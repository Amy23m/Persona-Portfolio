"use client";

import { useCallback, useRef, useState } from "react";
import DesktopIcon from "@/components/DesktopIcon";
import Taskbar from "@/components/Taskbar";
import WindowManager from "@/components/WindowManager";
import { APPS, APP_MAP } from "@/components/apps";
import type { AppId, WindowState } from "@/components/types";

const STAGGER_STEP = 36;
const BASE_X = 200;
const BASE_Y = 70;

const ICON_BASE_X = 24;
const ICON_BASE_Y = 24;
const ICON_STEP_Y = 136;

type IconPosition = { x: number; y: number };

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<AppId | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<AppId, IconPosition>>(
    () =>
      Object.fromEntries(
        APPS.map((app, i) => [app.id, { x: ICON_BASE_X, y: ICON_BASE_Y + i * ICON_STEP_Y }])
      ) as Record<AppId, IconPosition>
  );
  const zCounter = useRef(1);
  const openCount = useRef(0);

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

        const next: WindowState = {
          id,
          x: BASE_X + n * STAGGER_STEP,
          y: BASE_Y + n * STAGGER_STEP,
          width,
          height,
          minimized: false,
          maximized: false,
          zIndex: zCounter.current,
        };
        return [...prev, next];
      });
      setActiveId(id);
    },
    []
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

  const toggleMaximizeApp = useCallback((id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          const restored = w.prevBounds ?? { x: BASE_X, y: BASE_Y, width: w.width, height: w.height };
          return { ...w, maximized: false, ...restored, prevBounds: undefined };
        }
        return {
          ...w,
          maximized: true,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
        };
      })
    );
  }, []);

  const moveWindow = useCallback((id: AppId, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resizeWindow = useCallback((id: AppId, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    );
  }, []);

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
      <Taskbar
        windows={windows}
        appMeta={appMeta}
        activeId={activeId}
        onSelect={handleTaskbarSelect}
      />

      <div className="relative flex-1 overflow-hidden os-grid-bg">
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

        <WindowManager
          windows={windows}
          activeId={activeId}
          onFocus={focusApp}
          onClose={closeApp}
          onMinimize={minimizeApp}
          onToggleMaximize={toggleMaximizeApp}
          onMove={moveWindow}
          onResize={resizeWindow}
        />
      </div>
    </div>
  );
}
