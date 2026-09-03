"use client";

import OsWindow from "@/components/OsWindow";
import { APP_MAP } from "@/components/apps";
import type { WindowState } from "@/components/types";

type WindowManagerProps = {
  windows: WindowState[];
  activeId: string | null;
  onFocus: (id: WindowState["id"]) => void;
  onClose: (id: WindowState["id"]) => void;
  onMinimize: (id: WindowState["id"]) => void;
  onToggleMaximize: (id: WindowState["id"]) => void;
  onMove: (id: WindowState["id"], x: number, y: number) => void;
  onResize: (id: WindowState["id"], width: number, height: number) => void;
};

export default function WindowManager({
  windows,
  activeId,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
}: WindowManagerProps) {
  return (
    <>
      {windows
        .filter((w) => !w.minimized)
        .map((w) => {
          const app = APP_MAP[w.id];
          const Content = app.component;
          const Icon = app.icon;
          return (
            <OsWindow
              key={w.id}
              title={app.label.toUpperCase()}
              icon={<Icon className="h-full w-full" />}
              bounds={w}
              zIndex={w.zIndex}
              isActive={activeId === w.id}
              isMaximized={w.maximized}
              onFocus={() => onFocus(w.id)}
              onClose={() => onClose(w.id)}
              onMinimize={() => onMinimize(w.id)}
              onToggleMaximize={() => onToggleMaximize(w.id)}
              onMove={(x, y) => onMove(w.id, x, y)}
              onResize={(width, height) => onResize(w.id, width, height)}
            >
              <Content />
            </OsWindow>
          );
        })}
    </>
  );
}
