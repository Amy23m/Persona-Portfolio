"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PLAYLISTS } from "@/lib/music/playlists";
import type { PlaylistTrack } from "@/lib/music/types";
import { loadYoutubeIframeApi, type YouTubeIFrameAPI, type YouTubePlayer } from "./youtubeIframeApi";

export function useMusicPlayer() {
  const [activePlaylistId, setActivePlaylistId] = useState(PLAYLISTS[0].id);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);
  const [currentSeedId, setCurrentSeedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);
  const youtubeApiRef = useRef<YouTubeIFrameAPI | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const youtubePollRef = useRef<number | null>(null);

  const generationRef = useRef(0);

  const activePlaylist = PLAYLISTS.find((p) => p.id === activePlaylistId)!;

  const stopProgressPolling = useCallback(() => {
    if (youtubePollRef.current !== null) {
      window.clearInterval(youtubePollRef.current);
      youtubePollRef.current = null;
    }
  }, []);

  const startProgressPolling = useCallback(() => {
    stopProgressPolling();
    youtubePollRef.current = window.setInterval(() => {
      const player = youtubePlayerRef.current;
      if (!player) return;
      setPosition(player.getCurrentTime());
      const d = player.getDuration();
      if (d) setDuration(d);
    }, 500);
  }, [stopProgressPolling]);

  const playSeed = useCallback(
    async (seed: PlaylistTrack, playlistId: string) => {
      const generation = ++generationRef.current;
      setCurrentSeedId(seed.id);
      setCurrentPlaylistId(playlistId);
      setIsPlaying(true);
      setPosition(0);
      setDuration(0);

      if (!youtubeApiRef.current) {
        youtubeApiRef.current = await loadYoutubeIframeApi();
      }
      if (generation !== generationRef.current || !youtubeContainerRef.current) return;

      if (youtubePlayerRef.current) {
        // Player already went through onReady in an earlier playSeed call, so its methods are live now.
        youtubePlayerRef.current.loadVideoById(seed.youtubeId);
        youtubePlayerRef.current.playVideo();
        startProgressPolling();
      } else {
        youtubePlayerRef.current = new youtubeApiRef.current.Player(youtubeContainerRef.current, {
          videoId: seed.youtubeId,
          width: "1",
          height: "1",
          playerVars: { autoplay: 1, controls: 0, disablekb: 1, playsinline: 1 },
          events: {
            // getCurrentTime/getDuration only exist once onReady fires, so polling starts here.
            onReady: (e) => {
              if (generation !== generationRef.current) return;
              e.target.playVideo();
              startProgressPolling();
            },
            onStateChange: (e) => {
              if (generation !== generationRef.current) return;
              const YT = youtubeApiRef.current;
              if (!YT) return;
              setIsPlaying(e.data === YT.PlayerState.PLAYING);
            },
          },
        });
      }
    },
    [startProgressPolling]
  );

  const pause = useCallback(() => {
    youtubePlayerRef.current?.pauseVideo();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    youtubePlayerRef.current?.playVideo();
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSeedId) return;
    if (isPlaying) pause();
    else resume();
  }, [currentSeedId, isPlaying, pause, resume]);

  const seek = useCallback((seconds: number) => {
    youtubePlayerRef.current?.seekTo(seconds, true);
    setPosition(seconds);
  }, []);

  const stepTrack = useCallback(
    (direction: 1 | -1) => {
      if (!currentPlaylistId) return;
      const playlist = PLAYLISTS.find((p) => p.id === currentPlaylistId);
      const tracks = playlist?.tracks ?? [];
      if (!tracks.length) return;
      const currentIndex = tracks.findIndex((t) => t.id === currentSeedId);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + tracks.length) % tracks.length;
      void playSeed(tracks[nextIndex], currentPlaylistId);
    },
    [currentPlaylistId, currentSeedId, playSeed]
  );

  const next = useCallback(() => stepTrack(1), [stepTrack]);
  const prev = useCallback(() => stepTrack(-1), [stepTrack]);

  useEffect(() => stopProgressPolling, [stopProgressPolling]);

  const currentPlaylist = currentPlaylistId ? PLAYLISTS.find((p) => p.id === currentPlaylistId) : undefined;
  const currentSeed = currentPlaylist?.tracks.find((t) => t.id === currentSeedId) ?? null;

  return {
    playlists: PLAYLISTS,
    activePlaylist,
    activePlaylistId,
    setActivePlaylistId,
    currentPlaylistId,
    currentSeed,
    isPlaying,
    position,
    duration,
    playSeed,
    togglePlay,
    next,
    prev,
    seek,
    youtubeContainerRef,
  };
}
