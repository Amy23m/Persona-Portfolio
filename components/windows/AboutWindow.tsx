import Image from "next/image";
import { SOCIAL } from "@/components/socialLinks";

const SKILLS: Record<string, string[]> = {
  FRONTEND: ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS", "HTML5", "CSS3", "Figma"],
  BACKEND: ["Python", "FastAPI", "Flask", "Node.js", "REST APIs", "SSE", "Firebase", "Supabase"],
  "AI/ML": ["Anthropic Claude API", "Google Gemini API", "RAG", "pgvector", "Agentic AI", "Prompt Caching"],
  TOOLS: ["Git", "GitHub Actions", "VS Code", "Vercel", "Stripe", "CI/CD", "Agile/Scrum"],
};

export default function AboutWindow() {
  return (
    <div className="flex min-h-full flex-col gap-8 bg-os-overlay-2 p-6 text-foreground">
      <div className="flex flex-col gap-4 border border-os-border bg-os-overlay-1 p-5 sm:flex-row">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center border-2 border-os-blue">
          <Image
            src="/profile-pic.jpg"
            alt="Ayomide Oshilaja"
            fill
            sizes="96px"
            className="object-cover"
          />
          <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-os-blue" />
        </div>
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-pixel text-lg tracking-wide text-foreground">
              AYOMIDE OSHILAJA
            </h1>
            <span className="border border-os-blue/50 px-2 py-0.5 text-[10px] tracking-widest text-os-blue">
              AVAILABLE FOR HIRE
            </span>
          </div>
          <p className="mt-1 text-sm tracking-wide text-os-blue">
            SOFTWARE ENGINEER · CS STUDENT @ ASU
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/70">
            Hi! I'm Ayomide, a Computer Science Senior at Arizona State University concentrating in software engineering.
            I build full-stack web apps and Arduino-based hardware projects and I'm drawn to the intersection of software engineering and security, with my sights set on software developer roles.
            I like shipping things that are both technically solid and genuinely fun to use.
          </p>

          <a
           href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn mt-4 inline-flex items-center gap-2 border border-os-blue bg-os-blue/10 px-4 py-2 font-pixel text-[10px] tracking-[0.2em] text-os-blue transition-colors hover:bg-os-blue hover:text-black"
          >
            RESUME
          </a>

        </div>
      </div>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-pixel text-sm tracking-wide text-os-blue">
          <span className="text-foreground/40">{"//"}</span> SKILLS
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(SKILLS).map(([category, items]) => (
            <div key={category} className="border border-os-border bg-os-overlay-1 p-4">
              <p className="text-[10px] tracking-[0.2em] text-foreground/40">
                {category}
              </p>
              <p className="mt-2 text-sm text-foreground/85">{items.join(" ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-pixel text-sm tracking-wide text-os-blue">
          <span className="text-foreground/40">{"//"}</span> CONTACT
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SOCIAL.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-os-border bg-os-overlay-1 p-4 transition-colors hover:border-os-blue"
            >
              <span className="text-[10px] tracking-[0.2em] text-foreground/40">
                {item.label}
              </span>
              <span className="text-sm text-foreground/85">{item.value}</span>
            </a>
          ))}
        </div>
      </section>

      <p className="mt-auto pt-4 text-[10px] tracking-[0.2em] text-foreground/30">
        AYOMIDE OS // ABOUT.EXE
      </p>
    </div>
  );
}
