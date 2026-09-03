export type AppId = "about" | "experience" | "projects" | "connect" | "music";

export type WindowState = {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  prevBounds?: { x: number; y: number; width: number; height: number };
};
