"use client";

export type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
};

export type YouTubeIFrameAPI = {
  Player: new (
    elementId: HTMLElement | string,
    options: {
      videoId?: string;
      height?: string | number;
      width?: string | number;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (e: { target: YouTubePlayer }) => void;
        onStateChange?: (e: { data: number; target: YouTubePlayer }) => void;
      };
    }
  ) => YouTubePlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number };
};

declare global {
  interface Window {
    YT?: YouTubeIFrameAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const SCRIPT_ID = "youtube-iframe-api-script";
let apiPromise: Promise<YouTubeIFrameAPI> | null = null;

export function loadYoutubeIframeApi(): Promise<YouTubeIFrameAPI> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YouTubeIFrameAPI);
    };
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);
  });

  return apiPromise;
}
