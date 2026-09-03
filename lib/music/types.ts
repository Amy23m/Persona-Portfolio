export type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
};

export type Playlist = {
  id: string;
  label: string;
  emoji: string;
  tracks: PlaylistTrack[];
  /** Optional, decorative only — renders a plain Spotify embed iframe in the sidebar, not wired to playback. */
  spotifyPlaylistId?: string;
};
