"use client";

import { useState } from "react";
import ProjectCard3D from "@/components/ProjectCard3D";
import ProjectDetail from "@/components/ProjectDetail";
import { PROJECTS } from "@/data/projects";

export default function ProjectsWindow() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selected = PROJECTS.find((p) => p.slug === selectedSlug);

  return (
    <div className="flex min-h-full flex-col text-foreground">
      <div className="@container flex-1 p-6">
        {selected ? (
          <ProjectDetail
            project={selected}
            onBack={() => setSelectedSlug(null)}
          />
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-4 @3xl:grid-cols-12">
            {PROJECTS.map((project) => (
              <div
                key={project.slug}
                className={
                  project.span === "featured"
                    ? "col-span-1 @3xl:col-span-6"
                    : "col-span-1 @3xl:col-span-6"
                }
              >
                <ProjectCard3D project={project} onSelect={setSelectedSlug} />
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="border-t border-os-border/60 px-6 py-3 text-[10px] tracking-[0.2em] text-foreground/30">
        AYOMIDE OS // PROJECTS.EXE
      </p>
    </div>
  );
}
