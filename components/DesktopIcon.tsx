"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

type DesktopIconProps = {
  label: string;
  icon: ReactNode;
  onOpen: () => void;
  draggable?: boolean;
  x?: number;
  y?: number;
  onMove?: (x: number, y: number) => void;
};

const DRAG_THRESHOLD = 4;

export default function DesktopIcon({
  label,
  icon,
  x = 0,
  y = 0,
  onOpen,
  onMove,
  draggable = true,
}: DesktopIconProps) {
  const dragState = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (!onMove) return;
      e.preventDefault();
      dragState.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y, moved: false };

      const handleMove = (ev: PointerEvent) => {
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
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleUp);
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

  if (!draggable) {
    return (
      <button
        onClick={handleClick}
        className="group flex flex-col items-center gap-2 p-2 text-center outline-none"
      >
        <span className="flex h-16 w-16 items-center justify-center text-os-cyan transition-all group-hover:drop-shadow-[0_0_10px_rgba(45,226,255,0.55)] sm:h-20 sm:w-20">
          <span className="h-14 w-14 sm:h-16 sm:w-16">{icon}</span>
        </span>
        <span className="font-pixel text-[9px] tracking-wide text-foreground sm:text-[10px]">
          {label}
        </span>
      </button>
    );
  }

  return (
    <button
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      style={{ left: x, top: y, touchAction: "none" }}
      className="group pointer-events-auto absolute flex w-36 cursor-grab flex-col items-center gap-2 p-2 text-center outline-none active:cursor-grabbing"
    >
      <span className="flex h-24 w-24 items-center justify-center text-os-cyan transition-all group-hover:drop-shadow-[0_0_10px_rgba(45,226,255,0.55)]">
        <span className="h-20 w-20">{icon}</span>
      </span>
      <span className="font-pixel text-[10px] tracking-wide text-foreground">{label}</span>
    </button>
  );
}
