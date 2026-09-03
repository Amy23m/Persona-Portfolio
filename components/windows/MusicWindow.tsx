"use client";

import Image from "next/image";
import { useState } from "react";
import { useMusicPlayer } from "@/components/music/useMusicPlayer";
import { formatTime } from "@/components/music/formatTime";
import type { Playlist, PlaylistTrack } from "@/lib/music/types";

function artworkUrl(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export default function MusicWindow() {
  const {
    playlists,
    activePlaylist,
    activePlaylistId,
    setActivePlaylistId,
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
  } = useMusicPlayer();

  const [showInfo, setShowInfo] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-os-overlay-2 text-foreground">
      {nowPlayingOpen ? (
        <NowPlayingView
          currentSeed={currentSeed}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          next={next}
          prev={prev}
          onBack={() => setNowPlayingOpen(false)}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          {/* Sidebar */}
          <aside className="flex shrink-0 flex-col gap-1 overflow-y-auto border-b border-os-border bg-os-overlay-1 p-3 sm:w-44 sm:border-b-0 sm:border-r">
            <p className="mb-1 px-2 text-[10px] tracking-[0.2em] text-foreground/40">
              PLAYLISTS
            </p>
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => setActivePlaylistId(playlist.id)}
                className={`flex items-center gap-2 border px-2 py-2 text-left text-xs transition-colors ${
                  activePlaylistId === playlist.id
                    ? "border-os-blue bg-os-blue/10 text-os-blue"
                    : "border-transparent text-foreground/70 hover:border-os-border hover:text-foreground"
                }`}
              >
                <span>{playlist.emoji}</span>
                <span className="truncate">{playlist.label}</span>
              </button>
            ))}

            {playlists
              .filter((playlist) => playlist.spotifyPlaylistId)
              .map((playlist) => (
                <SpotifyEmbed key={`spotify-${playlist.id}`} playlist={playlist} />
              ))}

            <div className="relative mt-auto pt-3">
              <button
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                aria-label="About this player"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-os-blue/50 text-[10px] text-os-blue"
              >
                i
              </button>
              {showInfo && (
                <div className="absolute bottom-8 left-0 z-10 w-56 border border-os-blue/50 bg-os-panel p-3 text-[11px] leading-relaxed text-foreground/80 shadow-xl">
                  Every track plays straight from YouTube — full videos, not previews.
                </div>
              )}
            </div>
          </aside>

          {/* Track list */}
          <section className="min-h-0 flex-1 overflow-auto p-4">
            <h2 className="mb-3 flex items-center gap-2 font-pixel text-sm tracking-wide text-os-blue">
              <span className="text-foreground/40">{"//"}</span> {activePlaylist.label.toUpperCase()}
              <span className="ml-auto text-[10px] tracking-widest text-foreground/40">
                {activePlaylist.tracks.length} SONGS
              </span>
            </h2>

            <div className="flex flex-col gap-1">
              {activePlaylist.tracks.map((seed, index) => (
                <TrackRow
                  key={seed.id}
                  index={index}
                  seed={seed}
                  isActive={currentSeed?.id === seed.id}
                  isPlaying={isPlaying && currentSeed?.id === seed.id}
                  onPlay={() => playSeed(seed, activePlaylist.id)}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Player bar */}
      <div className="flex shrink-0 flex-col gap-2 border-t border-os-border bg-os-overlay-1 p-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => currentSeed && setNowPlayingOpen(true)}
            disabled={!currentSeed}
            aria-label="Open Now Playing"
            className="relative h-12 w-12 shrink-0 overflow-hidden border border-os-border bg-os-overlay-2 disabled:cursor-not-allowed"
          >
            {currentSeed ? (
              <Image
                src={artworkUrl(currentSeed.youtubeId)}
                alt={currentSeed.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-foreground/30">
                ♪
              </div>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-foreground/90">
              {currentSeed?.title ?? "Nothing playing"}
            </p>
            <p className="truncate text-[11px] text-foreground/50">
              {currentSeed?.artist ?? "Pick a song from the list"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={!currentSeed}
              aria-label="Previous"
              className="pixel-btn flex h-8 w-8 items-center justify-center border border-os-border text-foreground/70 hover:border-os-blue hover:text-os-blue disabled:opacity-30"
            >
              ⏮
            </button>
            <button
              onClick={togglePlay}
              disabled={!currentSeed}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="pixel-btn flex h-9 w-9 items-center justify-center border border-os-blue bg-os-blue/10 text-os-blue hover:bg-os-blue hover:text-black disabled:opacity-30"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              onClick={next}
              disabled={!currentSeed}
              aria-label="Next"
              className="pixel-btn flex h-8 w-8 items-center justify-center border border-os-border text-foreground/70 hover:border-os-blue hover:text-os-blue disabled:opacity-30"
            >
              ⏭
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-foreground/40">
          <span className="w-9 text-right">{formatTime(position)}</span>
          <input
            type="range"
            min={0}
            max={Math.max(duration, 1)}
            value={Math.min(position, Math.max(duration, 1))}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!currentSeed || !duration}
            className="h-1 flex-1 cursor-pointer accent-os-blue disabled:cursor-not-allowed"
          />
          <span className="w-9">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Real, hidden YouTube embed that actually streams the audio */}
      <div
        ref={youtubeContainerRef}
        className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
        aria-hidden
      />
    </div>
  );
}

function SpotifyEmbed({ playlist }: { playlist: Playlist }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${playlist.spotifyPlaylistId}`}
      title={`${playlist.label} on Spotify`}
      className="mt-2 h-40 w-full border-0"
      loading="lazy"
    />
  );
}

type NowPlayingViewProps = {
  currentSeed: PlaylistTrack | null;
  isPlaying: boolean;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  onBack: () => void;
};

function NowPlayingView({ currentSeed, isPlaying, togglePlay, next, prev, onBack }: NowPlayingViewProps) {
  const title = currentSeed?.title ?? "Nothing playing";
  const artist = currentSeed?.artist ?? "";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-6 p-8">
      <button
        onClick={onBack}
        aria-label="Back to playlists"
        className="pixel-btn absolute left-4 top-4 flex h-8 w-8 items-center justify-center border border-os-border text-foreground/70 hover:border-os-blue hover:text-os-blue"
      >
        ←
      </button>

      <div className="relative h-56 w-56 shrink-0 overflow-hidden border border-os-border bg-os-overlay-1 shadow-2xl">
        {currentSeed ? (
          <Image src={artworkUrl(currentSeed.youtubeId)} alt={title} fill sizes="224px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-foreground/30">
            ♪
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-base text-foreground/90">{title}</p>
        <p className="mt-1 text-sm text-foreground/50">{artist}</p>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={prev}
          disabled={!currentSeed}
          aria-label="Previous"
          className="pixel-btn flex h-11 w-11 items-center justify-center border border-os-border text-lg text-foreground/70 hover:border-os-blue hover:text-os-blue disabled:opacity-30"
        >
          ⏮
        </button>
        <button
          onClick={togglePlay}
          disabled={!currentSeed}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="pixel-btn flex h-14 w-14 items-center justify-center border border-os-blue bg-os-blue/10 text-2xl text-os-blue hover:bg-os-blue hover:text-black disabled:opacity-30"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button
          onClick={next}
          disabled={!currentSeed}
          aria-label="Next"
          className="pixel-btn flex h-11 w-11 items-center justify-center border border-os-border text-lg text-foreground/70 hover:border-os-blue hover:text-os-blue disabled:opacity-30"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}

type TrackRowProps = {
  index: number;
  seed: PlaylistTrack;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
};

function TrackRow({ index, seed, isActive, isPlaying, onPlay }: TrackRowProps) {
  return (
    <button
      onClick={onPlay}
      className={`group flex items-center gap-3 border px-2 py-2 text-left transition-colors ${
        isActive
          ? "border-os-blue bg-os-blue/10"
          : "border-transparent hover:border-os-border hover:bg-os-overlay-1"
      }`}
    >
      <span className="w-5 shrink-0 text-center text-[11px] text-foreground/40">
        {isActive && isPlaying ? "♫" : index + 1}
      </span>

      <div className="relative h-9 w-9 shrink-0 overflow-hidden border border-os-border bg-os-overlay-2">
        <Image src={artworkUrl(seed.youtubeId)} alt={seed.title} fill sizes="36px" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${isActive ? "text-os-blue" : "text-foreground/85"}`}>
          {seed.title}
        </p>
        <p className="truncate text-[11px] text-foreground/45">{seed.artist}</p>
      </div>
    </button>
  );
}
