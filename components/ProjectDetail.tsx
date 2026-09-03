import Image from "next/image";
import type { Project } from "@/data/projects";

export default function ProjectDetail({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  return (
    <div className="flex animate-fade-in flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-2 font-pixel text-[10px] tracking-wider text-os-blue transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">{"←"}</span> BACK
      </button>

      <div
        className="relative h-72 overflow-hidden rounded-t border border-os-border"
        style={{ backgroundImage: project.accentGradient }}
      >
        <div
          aria-hidden="true"
          className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-os-blue/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-os-cyan/15 blur-3xl"
        />

        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-contain p-6 drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
        />

        <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-pixel tracking-wide text-white backdrop-blur-sm">
          {project.role}
        </span>
      </div>

      <div className="border border-t-0 border-os-border bg-os-overlay-1 p-6">
        <h2 className="font-pixel text-base tracking-wide text-foreground">
          {project.title}
        </h2>

        <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed text-foreground/75">
          {project.about.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {project.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="border border-os-blue/30 bg-os-blue/5 px-2 py-0.5 text-[10px] tracking-wide text-os-blue/90 transition-colors hover:border-os-blue hover:bg-os-blue/15"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {(project.links.live || project.links.github || project.links.devpost) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn border border-os-blue bg-os-blue px-4 py-2 font-pixel text-[10px] tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
              >
                LIVE DEMO
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn border border-os-border px-4 py-2 font-pixel text-[10px] tracking-wider text-foreground/80 transition-colors hover:border-os-blue hover:text-os-blue"
              >
                GITHUB
              </a>
            )}
            {project.links.devpost && (
              <a
                href={project.links.devpost}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn border border-os-border px-4 py-2 font-pixel text-[10px] tracking-wider text-foreground/80 transition-colors hover:border-os-blue hover:text-os-blue"
              >
                DEVPOST
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
