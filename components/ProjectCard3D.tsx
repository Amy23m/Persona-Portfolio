"use client";

import Image from "next/image";
import type { Project } from "@/data/projects";

const CORNER_BRACKETS = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "left-0 bottom-0 border-l-2 border-b-2",
  "right-0 bottom-0 border-r-2 border-b-2",
];

export default function ProjectCard3D({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project.slug)}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded border border-os-border bg-os-overlay-1 text-left transition-all duration-200 hover:border-os-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
    >
      <div
        className="relative h-64 overflow-hidden rounded-t border-b border-os-border"
        style={{ backgroundImage: project.accentGradient }}
      >
        <div
          aria-hidden="true"
          className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-os-blue/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-os-cyan/15 blur-3xl"
        />

        <div
          className="@container/media absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <div
            className="
              relative h-[85%] w-[85%] will-change-transform
              [transform:rotateY(0)_rotateX(0)_scale(1)]
              @sm/media:[transform:rotateY(-18deg)_rotateX(6deg)_rotateZ(-2deg)_scale(1.08)]
              transition-transform duration-300 ease-out
              drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]
              group-hover:-translate-y-2 group-hover:scale-[1.03]
              motion-reduce:transition-none
              motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100
            "
          >
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="rounded object-cover"
            />
          </div>
        </div>

        <span
          className="
            absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-white/20
            bg-black/40 px-3 py-1 text-[10px] font-pixel tracking-wide text-white backdrop-blur-sm
            opacity-0 transition-opacity duration-200
            group-hover:opacity-100 group-focus-visible:opacity-100
          "
        >
          {project.role}
        </span>
      </div>

      <div className="flex-1 border border-t-0 border-os-border bg-os-overlay-1 p-4">
        <h3 className="font-pixel text-sm tracking-wide text-foreground transition-colors group-hover:text-os-blue">
          {project.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-foreground/70">
          {project.description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-pixel tracking-wide text-os-blue">
          VIEW PROJECT
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            {"→"}
          </span>
        </span>
      </div>

      {CORNER_BRACKETS.map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={`pointer-events-none absolute h-3 w-3 border-os-blue opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${position}`}
        />
      ))}
    </button>
  );
}
