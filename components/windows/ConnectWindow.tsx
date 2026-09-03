import { SOCIAL } from "@/components/socialLinks";

const BUTTON_STYLES: Record<string, string> = {
  Email: "border-os-red bg-os-red text-black",
  LinkedIn: "border-os-blue bg-os-blue text-black",
  GitHub: "border-os-border bg-os-overlay-2 text-foreground",
};

export default function ConnectWindow() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-10 bg-os-overlay-2 p-6 text-center text-foreground">
      <div>
        <p className="text-xs tracking-[0.35em] text-os-blue/80">
          WORLD 5 — UNDERGROUND
        </p>
        <h1 className="mt-3 font-pixel text-2xl tracking-widest text-foreground">
          LET&apos;S CONNECT
        </h1>
        <p className="mx-auto mt-4 max-w-sm font-mono text-sm leading-relaxed text-foreground/60">
          I&apos;m currently open to full-time software engineering opportunities and
          collaborations. Pick a channel below to reach out.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {SOCIAL.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`pixel-btn pixel-corners flex w-40 flex-col items-center gap-1 border-2 px-4 py-4 font-pixel text-[11px] tracking-widest transition-transform hover:scale-105 active:scale-95 ${BUTTON_STYLES[item.label]}`}
          >
            {item.label.toUpperCase()}
          </a>
        ))}
      </div>

      <p className="mt-auto pt-4 text-[10px] tracking-[0.2em] text-foreground/30">
        AYOMIDE OS // CONNECT.EXE
      </p>
    </div>
  );
}
