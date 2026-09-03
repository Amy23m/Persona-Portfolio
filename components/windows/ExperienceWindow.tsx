const JOBS = [
  {
    role: "SOFTWARE ENGINEER INTERN",
    company: "JUSTPLATYPOST LLC",
    period: "MAR 2026 — PRESENT",
    type: "REMOTE",
    bullets: [
      "Engineered the AI/ML foundation and core internal tools of the Tukd platform in TypeScript, building a streaming Anthropic Claude SDK wrapper with prompt caching and tool use loop orchestration that powers 100% of downstream code generation",
      "Designed and evaluated Server-Sent Events (SSE) streaming API routes for real-time text deltas, tool events, and file update notifications, achieving sub-200ms first-token latency",
      "Redesigned the product UI/UX in Figma and shipped a cross-platform design system of 20+ reusable Tailwind CSS and React components spanning the Next.js landing page and React Native / Expo mobile preview",
      "Practiced full Agile/Scrum workflow, opening 10+ pull requests, addressing code review feedback, and resolving deployment issues through twice-weekly standups",
    ],
    tech: ["TypeScript", "Next.js", "React Native", "Claude API", "Tailwind CSS"],
  },
  {
    role: "CODE COACH",
    company: "THECODERSCHOOL",
    period: "APR 2026 — PRESENT",
    type: "TEMPE, AZ",
    bullets: [
      "Teach 1 on 1 and small group coding lessons to K-12 students, translating concepts such as loops, functions, and object-oriented design into age-appropriate, project-based instruction",
      "Design individualized learning plans and debug student projects in real time across Python, Scratch, and JavaScript, adapting explanations to each student's pace and learning style",
    ],
    tech: ["Python", "JavaScript", "Scratch"],
  },
];

const EDUCATION = [
  {
    degree: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE(SOFTWARE ENGINEERING)",
    school: "ARIZONA STATE UNIVERSITY",
    year: "EXP. 12/27",
    //gpa: "3.45",
  },
];

export default function ExperienceWindow() {
  const handleDownload = () => {
    const resumeUrl = "/resume.pdf";
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "resume.pdf";
    link.click();
  };

  return (
    <div className="flex min-h-full flex-col gap-8 bg-os-overlay-2 p-6 text-foreground">
      <section>
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 font-pixel text-sm tracking-wide text-os-blue">
            <span className="text-foreground/40">{"//"}</span> CAREER
          </h2>
          <button
            onClick={handleDownload}
            className="pixel-btn flex items-center gap-2 border border-os-blue bg-os-blue px-4 py-2 font-pixel text-[10px] tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
          >
            <span>&#8595;</span> DOWNLOAD RESUME
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {JOBS.map((job) => (
            <div
              key={job.role + job.company}
              className="relative border border-os-border bg-os-overlay-1 p-5"
            >
              <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-os-blue" />
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-pixel text-sm tracking-wide text-foreground">
                    {job.role}
                  </h3>
                  <p className="text-sm tracking-wide text-os-blue">{job.company}</p>
                </div>
                <div className="text-right text-xs tracking-wide text-foreground/50">
                  <p>{job.period}</p>
                  <p>{job.type}</p>
                </div>
              </div>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-foreground/75">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-os-blue">·</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs tracking-wide text-os-blue/80">
                {job.tech.join("  ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-pixel text-sm tracking-wide text-os-blue">
          <span className="text-foreground/40">{"//"}</span> EDUCATION
        </h2>
        <div className="flex flex-col gap-3">
          {EDUCATION.map((edu) => (
            <div
              key={edu.degree}
              className="flex flex-wrap items-center justify-between gap-2 border border-os-border bg-os-overlay-1 p-4"
            >
              <div>
                <p className="font-pixel text-xs tracking-wide text-foreground">
                  {edu.degree}
                </p>
                <p className="text-sm text-os-blue">{edu.school}</p>
              </div>
              <div className="text-right text-xs tracking-wide text-foreground/50">
                <p>{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-auto pt-4 text-[10px] tracking-[0.2em] text-foreground/30">
        AYOMIDE OS // EXPERIENCE.EXE
      </p>
    </div>
  );
}
