"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DesktopIcon from "@/components/DesktopIcon";
import Taskbar from "@/components/Taskbar";
import WindowManager from "@/components/WindowManager";
import { APPS, APP_MAP } from "@/components/apps";
import type { AppId, WindowState } from "@/components/types";
import { COMPACT_BREAKPOINT, EDGE_MARGIN, MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from "@/components/window-constants";

const STAGGER_STEP = 36;
const BASE_X = 200;
const BASE_Y = 70;

const ICON_BASE_X = 24;
const ICON_BASE_Y = 24;
const ICON_STEP_Y = 136;

const DEFAULT_TASKBAR_HEIGHT = 44;

type IconPosition = { x: number; y: number };
type Bounds = { x: number; y: number; width: number; height: number };

/**
 * Fits a window's full bounds (position + size) inside the content area below the
 * taskbar. `contentHeight` is the height of the area windows actually render in
 * (viewport height minus the taskbar's real rendered height, insets included) —
 * window y-coordinates are local to that area, not the full page.
 */
function fitBoundsToViewport(bounds: Bounds, viewportWidth: number, contentHeight: number): Bounds {
  const maxWidth = Math.max(MIN_WINDOW_WIDTH, viewportWidth - EDGE_MARGIN * 2);
  const maxHeight = Math.max(MIN_WINDOW_HEIGHT, contentHeight - EDGE_MARGIN * 2);
  const width = Math.min(bounds.width, maxWidth);
  const height = Math.min(bounds.height, maxHeight);
  const maxX = Math.max(EDGE_MARGIN, viewportWidth - width - EDGE_MARGIN);
  const maxY = Math.max(EDGE_MARGIN, contentHeight - height - EDGE_MARGIN);
  return {
    width,
    height,
    x: Math.min(Math.max(bounds.x, EDGE_MARGIN), maxX),
    y: Math.min(Math.max(bounds.y, EDGE_MARGIN), maxY),
  };
}

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<AppId | null>(null);
  // Starts null so the very first client render matches the server-rendered markup
  // exactly (the server has no window to read a size from). Populated on mount by
  // the effect below — a real screen size only ever exists on the client.
  const [viewport, setViewport] = useState<{ width: number; height: number } | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<AppId, IconPosition>>(
    () =>
      Object.fromEntries(
        APPS.map((app, i) => [app.id, { x: ICON_BASE_X, y: ICON_BASE_Y + i * ICON_STEP_Y }])
      ) as Record<AppId, IconPosition>
  );
  const zCounter = useRef(1);
  const openCount = useRef(0);
  const taskbarRef = useRef<HTMLDivElement>(null);
  const [taskbarHeight, setTaskbarHeight] = useState(DEFAULT_TASKBAR_HEIGHT);

  const viewportWidth = viewport?.width ?? 1280;
  const viewportHeight = viewport?.height ?? 800;
  // The area windows actually render in — a flex sibling below the taskbar, so a
  // window's y-coordinate of 0 is already "top of usable area," not "top of page."
  const contentHeight = viewportHeight - taskbarHeight;
  const isCompact = viewport !== null && viewportWidth < COMPACT_BREAKPOINT;

  // Track real viewport size (resize + orientation change) and re-fit any floating
  // windows so they never end up stranded outside the visible area. Also re-measures
  // the taskbar's real rendered height, which grows on notched devices once safe-area
  // padding is applied, so it can't be treated as a fixed constant.
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const measuredTaskbarHeight =
        taskbarRef.current?.getBoundingClientRect().height ?? DEFAULT_TASKBAR_HEIGHT;
      setViewport({ width, height });
      setTaskbarHeight(measuredTaskbarHeight);
      const nextContentHeight = height - measuredTaskbarHeight;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.maximized) return w;
          return { ...w, ...fitBoundsToViewport(w, width, nextContentHeight) };
        })
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // In compact mode every window displays maximized, without touching the underlying
  // stored bounds/maximized state — so widening back past the breakpoint restores
  // exactly whatever floating layout was there before, with no special-casing needed.
  const displayWindows = isCompact
    ? windows.map((w) => (w.maximized ? w : { ...w, maximized: true }))
    : windows;

  const moveIcon = useCallback((id: AppId, x: number, y: number) => {
    setIconPositions((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const focusApp = useCallback((id: AppId) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setActiveId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: z, minimized: false } : w))
    );
  }, []);

  const openApp = useCallback(
    (id: AppId) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === id);
        if (existing) return prev;

        const n = openCount.current;
        openCount.current += 1;
        const { width, height } = APP_MAP[id].defaultSize;
        zCounter.current += 1;

        const bounds = fitBoundsToViewport(
          {
            x: BASE_X + n * STAGGER_STEP,
            y: BASE_Y + n * STAGGER_STEP,
            width,
            height,
          },
          viewportWidth,
          contentHeight
        );

        const next: WindowState = {
          id,
          ...bounds,
          minimized: false,
          maximized: false,
          zIndex: zCounter.current,
        };
        return [...prev, next];
      });
      setActiveId(id);
    },
    [viewportWidth, contentHeight]
  );

  const closeApp = useCallback((id: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const toggleMaximizeApp = useCallback(
    (id: AppId) => {
      if (isCompact) return;
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          if (w.maximized) {
            const restored = w.prevBounds ?? { x: BASE_X, y: BASE_Y, width: w.width, height: w.height };
            const fitted = fitBoundsToViewport(restored, viewportWidth, contentHeight);
            return { ...w, maximized: false, ...fitted, prevBounds: undefined };
          }
          return {
            ...w,
            maximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          };
        })
      );
    },
    [isCompact, viewportWidth, contentHeight]
  );

  const moveWindow = useCallback(
    (id: AppId, x: number, y: number) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          const maxX = Math.max(0, viewportWidth - w.width);
          const maxY = Math.max(0, contentHeight - w.height);
          return {
            ...w,
            x: Math.min(Math.max(x, 0), maxX),
            y: Math.min(Math.max(y, 0), maxY),
          };
        })
      );
    },
    [viewportWidth, contentHeight]
  );

  const resizeWindow = useCallback(
    (id: AppId, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          const maxWidth = Math.max(MIN_WINDOW_WIDTH, viewportWidth - w.x - EDGE_MARGIN);
          const maxHeight = Math.max(MIN_WINDOW_HEIGHT, contentHeight - w.y - EDGE_MARGIN);
          return { ...w, width: Math.min(width, maxWidth), height: Math.min(height, maxHeight) };
        })
      );
    },
    [viewportWidth, contentHeight]
  );

  const handleTaskbarSelect = useCallback(
    (id: AppId) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (win.minimized) {
        focusApp(id);
        return;
      }
      if (activeId === id) {
        minimizeApp(id);
      } else {
        focusApp(id);
      }
    },
    [windows, activeId, focusApp, minimizeApp]
  );

  const appMeta = Object.fromEntries(
    APPS.map((app) => [app.id, { label: app.label, icon: <app.icon className="h-full w-full" /> }])
  ) as Record<AppId, { label: string; icon: React.ReactNode }>;

  return (
    <div className="relative flex h-full w-full flex-col bg-os-dark">
      <div ref={taskbarRef} className="shrink-0">
        <Taskbar
          windows={windows}
          appMeta={appMeta}
          activeId={activeId}
          onSelect={handleTaskbarSelect}
        />
      </div>

      <div className="relative flex-1 overflow-hidden os-grid-bg">
        {viewport && (
          <>
            {isCompact ? (
              <div className="grid h-full grid-cols-3 content-start gap-2 overflow-y-auto p-4 sm:grid-cols-4">
                {APPS.map((app) => (
                  <DesktopIcon
                    key={app.id}
                    label={app.label}
                    icon={<app.icon className="h-full w-full" />}
                    onOpen={() => openApp(app.id)}
                    draggable={false}
                  />
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {APPS.map((app) => (
                  <DesktopIcon
                    key={app.id}
                    label={app.label}
                    icon={<app.icon className="h-full w-full" />}
                    x={iconPositions[app.id].x}
                    y={iconPositions[app.id].y}
                    onOpen={() => openApp(app.id)}
                    onMove={(x, y) => moveIcon(app.id, x, y)}
                  />
                ))}
              </div>
            )}

            <WindowManager
              windows={displayWindows}
              activeId={activeId}
              isCompact={isCompact}
              onFocus={focusApp}
              onClose={closeApp}
              onMinimize={minimizeApp}
              onToggleMaximize={toggleMaximizeApp}
              onMove={moveWindow}
              onResize={resizeWindow}
            />
          </>
        )}
      </div>
    </div>
  );
}
