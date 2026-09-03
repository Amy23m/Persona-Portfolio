"use client";

import { useEffect, useRef, useState } from "react";

type BootLogLine = { text: string; status?: string };

const BOOT_LOG: BootLogLine[] = [
  { text: "> initializing kernel..." },
  { text: "> mounting /persona/filesystem", status: "ok" },
  { text: "> loading profile data", status: "ok" },
  { text: "> decrypting career records", status: "ok" },
  { text: "> indexing project archives", status: "ok" },
  { text: "> calibrating interface", status: "ok" },
  { text: "> establishing uplink", status: "ONLINE" },
];

type BootScreenProps = {
  onBoot: () => void;
};

export default function BootScreen({ onBoot }: BootScreenProps) {
  const [booting, setBooting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const startBoot = () => {
    if (booting) return;
    setBooting(true);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 4, 100);
        const count = Math.min(
          Math.floor((next / 100) * BOOT_LOG.length) + 1,
          BOOT_LOG.length
        );
        setRevealedCount(count);

        if (next >= 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
          setTimeout(() => setLeaving(true), 350);
          setTimeout(onBoot, 850);
        }
        return next;
      });
    }, 60);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [revealedCount]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-os-dark os-grid-bg os-scanlines overflow-hidden ${
        leaving ? "os-fade-out" : ""
      }`}
    >
      <div className="os-slash-tl" />
      <div className="os-slash-br" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 font-pixel text-[10px] tracking-[0.35em] text-os-blue/80">
          SYSTEM BOOT — v1.0.0
        </p>

        <h1
          className="os-glitch font-display text-7xl sm:text-8xl md:text-9xl leading-none text-foreground"
          style={{
            WebkitTextStroke: "2px var(--os-blue)",
            textShadow: "0 0 24px rgba(26,140,255,0.55)",
          }}
        >
          AYOMIDE OSHILAJA
        </h1>
        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl leading-none text-os-blue mt-2 os-flicker">
          OS
        </h2>

        <p className="mt-8 text-sm tracking-[0.3em] text-foreground/50">
          INTERACTIVE PORTFOLIO SYSTEM
        </p>

        <div className="my-8 h-2 w-2 rotate-45 bg-os-blue" />

        {!booting ? (
          <>
            <button
              onClick={startBoot}
              className="pixel-btn pixel-corners group flex items-center gap-3 border-2 border-os-blue bg-os-blue px-10 py-4 font-pixel text-base tracking-wider text-black transition-transform hover:scale-105 hover:bg-white active:scale-95"
            >
              <span className="border-y-8 border-l-[14px] border-y-transparent border-l-black" />
              PRESS START
            </button>
            <p className="mt-4 text-xs tracking-[0.25em] text-foreground/40">
              — CLICK TO ENTER DESKTOP —
            </p>
          </>
        ) : (
          <div className="w-full max-w-md">
            <div className="h-4 w-full border border-os-blue/60 bg-os-overlay-2 p-0.5">
              <div
                className="os-progress-fill h-full transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              ref={logRef}
              className="mt-3 h-28 w-full overflow-y-auto border border-os-blue/20 bg-os-overlay-2 p-2 text-left font-mono text-[11px] leading-relaxed text-os-cyan"
            >
              {BOOT_LOG.slice(0, revealedCount).map((line, i) => (
                <p key={line.text} className={i === revealedCount - 1 ? "os-fade-in" : ""}>
                  {line.text}
                  {line.status && (
                    <span
                      className={`ml-2 ${
                        line.status === "ONLINE" ? "text-os-blue os-flicker" : "text-foreground/50"
                      }`}
                    >
                      {line.status}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 py-3 font-pixel text-[9px] tracking-[0.2em] text-foreground/40">
        <span>AYOMIDE OSHILAJA OS </span>
        <span>BUILD 2025 // READY</span>
      </div>
    </div>
  );
}
