"use client";

import {
  useCallback,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

export type WindowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type OsWindowProps = {
  title: string;
  icon: ReactNode;
  bounds: WindowBounds;
  zIndex: number;
  isActive: boolean;
  isMaximized: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  children: ReactNode;
};

const MIN_WIDTH = 380;
const MIN_HEIGHT = 300;

export default function OsWindow({
  title,
  icon,
  bounds,
  zIndex,
  isActive,
  isMaximized,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onMove,
  onResize,
  children,
}: OsWindowProps) {
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );
  const resizeState = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(
    null
  );

  const handleTitleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (isMaximized) return;
      e.preventDefault();
      onFocus();
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: bounds.x,
        origY: bounds.y,
      };
      const handleMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;
        onMove(
          Math.max(0, dragState.current.origX + dx),
          Math.max(0, dragState.current.origY + dy)
        );
      };
      const handleUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [bounds.x, bounds.y, isMaximized, onFocus, onMove]
  );

  const handleResizeMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (isMaximized) return;
      onFocus();
      resizeState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origW: bounds.width,
        origH: bounds.height,
      };
      const handleMove = (ev: MouseEvent) => {
        if (!resizeState.current) return;
        const dx = ev.clientX - resizeState.current.startX;
        const dy = ev.clientY - resizeState.current.startY;
        onResize(
          Math.max(MIN_WIDTH, resizeState.current.origW + dx),
          Math.max(MIN_HEIGHT, resizeState.current.origH + dy)
        );
      };
      const handleUp = () => {
        resizeState.current = null;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [bounds.width, bounds.height, isMaximized, onFocus, onResize]
  );

  const style = isMaximized
    ? { top: 44, left: 0, right: 0, bottom: 0, zIndex }
    : {
        top: bounds.y,
        left: bounds.x,
        width: bounds.width,
        height: bounds.height,
        zIndex,
      };

  return (
    <div
      className={`absolute flex flex-col border bg-os-panel backdrop-blur-sm shadow-2xl transition-opacity ${
        isActive ? "border-os-blue/70 opacity-100" : "border-os-border opacity-80"
      }`}
      style={style}
      onMouseDown={onFocus}
    >
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={onToggleMaximize}
        className={`flex shrink-0 cursor-move items-center justify-between border-b px-3 py-2 select-none ${
          isActive ? "border-os-blue/60 bg-os-titlebar" : "border-os-border bg-os-titlebar/70"
        }`}
      >
        <div className="flex items-center gap-2 text-os-blue">
          <span className="h-4 w-4">{icon}</span>
          <span className="font-pixel text-[11px] tracking-wider text-foreground">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            aria-label="Minimize"
            className="flex h-5 w-5 items-center justify-center border border-os-border text-foreground/60 hover:border-os-blue hover:text-os-blue"
          >
            <span className="block h-px w-2.5 bg-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            aria-label="Maximize"
            className="flex h-5 w-5 items-center justify-center border border-os-border text-foreground/60 hover:border-os-blue hover:text-os-blue"
          >
            <span className="block h-2 w-2 border border-current" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            className="flex h-5 w-5 items-center justify-center border border-os-border text-foreground/60 hover:border-os-red hover:text-os-red"
          >
            <span className="block text-xs leading-none">×</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-auto os-grid-bg">{children}</div>

      {!isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
        >
          <svg viewBox="0 0 16 16" className="h-full w-full text-os-blue/50">
            <path
              d="M14 2L2 14M14 8L8 14M14 14L14 14"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
