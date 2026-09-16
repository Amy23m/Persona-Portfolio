"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { AppId, WindowState } from "@/components/types";
import { useTheme } from "@/components/ThemeProvider";

type TaskbarProps = {
  windows: WindowState[];
  appMeta: Record<AppId, { label: string; icon: ReactNode }>;
  activeId: AppId | null;
  onSelect: (id: AppId) => void;
};

export default function Taskbar({ windows, appMeta, activeId, onSelect }: TaskbarProps) {
  const [time, setTime] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative z-30 flex min-h-11 shrink-0 items-center gap-2 border-b border-os-border bg-os-titlebar/90 px-2 pt-safe pl-safe pr-safe sm:gap-6 sm:px-4">
      <span className="shrink-0 font-pixel text-[10px] tracking-wider text-foreground sm:text-xs md:text-sm">
        AYOMIDE OS
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
        {windows.map((w) => (
          <button
            key={w.id}
            onClick={() => onSelect(w.id)}
            className={`flex shrink-0 items-center gap-1.5 border px-2 py-1 text-xs tracking-wide transition-colors ${
              activeId === w.id && !w.minimized
                ? "border-os-blue bg-os-blue/15 text-os-blue"
                : "border-os-border text-foreground/50 hover:text-foreground/80"
            }`}
          >
            <span className="h-3 w-3">{appMeta[w.id].icon}</span>
            <span className="hidden sm:inline">{appMeta[w.id].label.toUpperCase()}</span>
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 text-xs tracking-wide text-foreground/60 sm:gap-3">
        <span className="hidden items-center gap-1.5 sm:flex">
          <span className="h-1.5 w-1.5 bg-os-blue" />
          ONLINE
        </span>
        <button
          onClick={toggleTheme}
          className="pixel-btn flex items-center gap-1.5 border border-os-border px-2 py-1 font-pixel text-[9px] tracking-wide text-foreground/80 transition-colors hover:border-os-blue hover:text-os-blue sm:px-3 sm:text-[10px]"
        >
          {theme === "dark" ? "☾ DARK" : "☀ LIGHT"}
        </button>
        <span className="hidden text-foreground/40 sm:inline">{time}</span>
      </div>
    </header>
  );
}
