"use client";

import { useCallback, useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

type DesktopIconProps = {
  label: string;
  icon: ReactNode;
  x: number;
  y: number;
  onOpen: () => void;
  onMove: (x: number, y: number) => void;
};

const DRAG_THRESHOLD = 4;

export default function DesktopIcon({ label, icon, x, y, onOpen, onMove }: DesktopIconProps) {
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dragState.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y, moved: false };

      const handleMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;

        if (!dragState.current.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
          dragState.current.moved = true;
          suppressClick.current = true;
        }

        if (dragState.current.moved) {
          onMove(Math.max(0, dragState.current.origX + dx), Math.max(0, dragState.current.origY + dy));
        }
      };

      const handleUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [x, y, onMove]
  );

  const handleClick = useCallback(() => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    onOpen();
  }, [onOpen]);

  return (
    <button
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{ left: x, top: y }}
      className="group pointer-events-auto absolute flex w-36 cursor-grab flex-col items-center gap-2 p-2 text-center outline-none active:cursor-grabbing"
    >
      <span className="flex h-24 w-24 items-center justify-center text-os-cyan transition-all group-hover:drop-shadow-[0_0_10px_rgba(45,226,255,0.55)]">
        <span className="h-20 w-20">{icon}</span>
      </span>
      <span className="font-pixel text-[10px] tracking-wide text-foreground">{label}</span>
    </button>
  );
}
