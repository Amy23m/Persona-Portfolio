export type ProjectSpan = "featured" | "standard";

export type Project = {
  slug: string;
  title: string;
  description: string;
  /** Longer write-up shown on the project detail page (process, tech, context). */
  about: string;
  /** Placeholder — confirm/edit actual project roles before shipping. */
  role: string;
  image: string;
  tech: string[];
  links: { live?: string; github?: string; devpost?: string };
  accentGradient: string;
  span: ProjectSpan;
};

export const PROJECTS: Project[] = [
  {
    slug: "pulseplay",
    title: "PULSEPLAY",
    description:
      "Music discovery app that recommends songs from your real-time heart rate, read live off an Arduino pulse sensor.",
    about:
      "PulsePlay is a full-stack music discovery app that turns your real heartbeat into a personalized soundtrack. Rather than picking songs by genre or mood manually, PulsePlay reads live beats-per-minute data from an Arduino pulse sensor and matches it to tracks pulled from the iTunes Search API in real time.\n\n" +
      "The hardware side runs on an Arduino board wired to a pulse sensor on analog pin A0, streaming raw signal data over a 115200-baud serial connection. The web app talks directly to that hardware from the browser using the Web Serial API — no native app or driver install required — parsing the incoming signal to calculate a rolling BPM reading and surfacing it live in a \"COLLECTING\" counter and pulse-signal monitor on screen. For anyone without the sensor on hand, there's a manual BPM entry mode that unlocks the same recommendation flow.\n\n" +
      "Once a BPM value is available, PulsePlay queries the iTunes Search API for tracks whose tempo profile fits the reading, giving users a \"Rhythm Adventure\" playlist that shifts as their heart rate does. Account state is handled through Supabase auth, and the whole frontend is built in Next.js and TypeScript with a deliberately retro, pixel-art UI — chiptune-style fonts, dotted starfields, and a synthwave color palette.\n\n" +
      "Building it meant working across three layers that don't normally talk to each other: embedded hardware (the Arduino sketch reading analog voltage off the sensor and writing it to serial), a browser-based serial client (translating that raw signal into a usable BPM number using the still-fairly-new Web Serial API, which only a handful of browsers support), and a conventional web stack. Getting a noisy analog pulse signal to reliably resolve into a stable BPM reading in real time was the trickiest part — pulse sensors are sensitive to finger placement and movement, so the app includes a live serial monitor panel so users can see the raw signal and diagnose a bad connection before it throws off their recommendations.\n\n" +
      "Tech stack: Next.js, TypeScript, Supabase, Arduino, Web Serial API.",
    role: "Solo Developer",
    image: "/projects/pulseplay1.png",
    tech: ["Next.js", "TypeScript", "Supabase", "Arduino", "Web Serial API"],
    links: { live: "https://pulseplay-roan.vercel.app/" },
    accentGradient:
      "linear-gradient(135deg, rgba(26,140,255,0.35), rgba(45,226,255,0.15))",
    span: "featured",
  },
  {
    slug: "polarix",
    title: "POLARIX",
    description:
      "AI-powered policy comparison platform that turns dense insurance, financial, and legal documents into clear, side-by-side comparisons.",
    about:
      "Polarix (submitted to Devpost as \"Polarx\") is a hackathon project built by team PixelPirates — Ayomide Oshilaja, Hansini Podila, Supraja Sreevatsan, and Jahaira Flores — for Innovation Hacks 2.0. It's an intelligent policy comparison platform aimed at making dense, technical documents (insurance policies, financial plans, service agreements) actually readable.\n\n" +
      "The core problem: policies are long, jargon-heavy, and hard to compare side by side, so people default to picking blind or not comparing at all. Polarix (named after Polaris, the north star) tackles that by letting users view multiple policies in a clean, structured layout instead of a wall of text, automatically highlighting the differences that actually matter between them, and generating AI-written summaries that translate legal/financial language into plain English. A feasibility scoring system rates how well a given policy fits a user's specific situation, and a real-time alert system flags policy updates as they happen. On the organization side, an admin dashboard lets policy providers upload documents, manage coverage data, and track usage.\n\n" +
      "The stack splits across three layers: a React frontend styled with Tailwind CSS and Material UI for the comparison views and dashboards; a Node.js/Express backend handling API requests, business logic, and JWT-based authentication with role-based access control; and a PostgreSQL database via Supabase storing user profiles, policy documents, and alert data. An AI/ML layer sits on top of the backend, processing uploaded policy text and generating the plain-language summaries.\n\n" +
      "The hardest parts were largely about wrangling unstructured data under a hackathon clock: pulling meaningful, comparable fields out of policy documents with no consistent format, keeping AI-generated summaries accurate enough not to drop legally or financially important details, and deciding which differences between two policies were actually worth surfacing versus noise. Standing up secure JWT auth with proper role separation and designing a database schema flexible enough for wildly different policy types took real iteration, and coordinating a four-person full-stack build across frontend, backend, database, and AI integration in a tight window meant a lot of parallel work landing at the very end.\n\n" +
      "By submission, the team had a working full-stack platform: side-by-side comparison UI, AI-simplified summaries, feasibility scoring, an admin dashboard, and working authentication. Planned next steps include better AI accuracy and explainability, PDF/OCR ingestion for uploaded documents, deeper personalization, real-time pricing integrations, and an LLM-powered Q&A assistant for policy questions.\n\n" +
      "Tech stack: React, Node.js, Express, PostgreSQL, Supabase, JWT, Tailwind CSS, Material UI.",
    role: "Full-Stack Developer, Team PixelPirates",
    image: "/projects/polarix.png",
    tech: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Supabase",
      "JWT",
      "Tailwind CSS",
    ],
    links: {
      live: "https://pixel-pirates-anton.vercel.app",
      github: "https://github.com/Supraja2305/PixelPirates_Anton",
      devpost: "https://devpost.com/software/polarx_pixelpirates_antontrack",
    },
    accentGradient:
      "linear-gradient(135deg, rgba(45,226,255,0.30), rgba(26,140,255,0.15))",
    span: "featured",
  },
  {
    slug: "safetrack",
    title: "SAFETRACK",
    description:
      "Community safety tracking desktop app with GPS-based location monitoring and encrypted data handling, built through ASU's EPICS program.",
    about:
      "SafeTrack is a community safety tracking desktop application built through Arizona State University's EPICS (Engineering Projects in Community Service) program, where student teams partner directly with local organizations to build software around a real community need rather than a hypothetical one.\n\n" +
      "The core idea is straightforward: give community members and the organizers supporting them a way to monitor location and safety status in real time, without exposing sensitive data to anyone who shouldn't see it. The app is built with Python and PyQt6 for the desktop interface, backed by a local SQLite database for persistence. Security was treated as a first-class requirement rather than an afterthought — user credentials are hashed with bcrypt rather than stored in any recoverable form, and location and personal data at rest is encrypted with Fernet symmetric encryption, so a compromised database file alone isn't enough to expose anyone's information. GPS-based location monitoring feeds into a mesh-networking layer, aimed at keeping the system usable in situations where a stable, centralized internet connection can't be assumed.\n\n" +
      "Because this was an EPICS project, a meaningful part of the work happened before any code was written: translating conversations with actual community stakeholders into concrete software requirements, then checking that translation against their real workflows as the app took shape, rather than guessing at what \"safety tracking\" should mean in the abstract. That stakeholder-first process shaped decisions like prioritizing encryption and authentication early, since the community partner's core concern was trust — people needed to believe the system wouldn't leak their location or personal data before they'd be willing to use it at all.\n\n" +
      "Tech stack: Python, PyQt6, SQLite, bcrypt, Fernet encryption, mesh networking.",
    role: "Software Engineer, ASU EPICS Team",
    image: "/projects/Safetrack.jpeg",
    tech: ["Python", "PyQt6", "SQLite", "Mesh Networking"],
    links: {},
    accentGradient:
      "linear-gradient(135deg, rgba(255,45,85,0.25), rgba(26,140,255,0.12))",
    span: "standard",
  },
  {
    slug: "jobi-career-coach",
    title: "JOBI CAREER COACH",
    description:
      "Web-based AI career assistant with a real-time conversational interface, built on Google's Gemini API and a Flask backend.",
    about:
      "Jobi is a web-based AI career assistant — a chatbot that gives people real-time, conversational advice on job searches, career transitions, and professional development. It started as a personal build for Codedex's June monthly coding challenge, and grew into a fully deployed app with its own live URL.\n\n" +
      "The backend runs on Python and Flask, with Flask-CORS handling cross-origin requests and Gunicorn serving the app in production. All the actual career guidance comes from Google's Gemini API — the Flask backend forwards a user's message to Gemini, gets back a response, and streams it to the frontend along with typing-indicator state so the chat feels responsive rather than like a form submission. Gemini's responses often include structured content (bullet lists, bold emphasis, headers), so the frontend uses Showdown.js to convert that markdown into properly formatted HTML on the fly rather than dumping raw markdown syntax into the chat bubbles.\n\n" +
      "The frontend itself is deliberately simple: plain HTML5, CSS3, and vanilla JavaScript, no framework. The design leans into a glassmorphism look — translucent panels, soft blur, smooth hover transitions — with distinct message-bubble styling for the user versus the AI, a typing animation while a response is being generated, and graceful error states if the API call fails or the connection drops. It's responsive by default, so the same interface works on both desktop and mobile without a separate layout.\n\n" +
      "Deployment is handled through Render, configured via a render.yaml file and an environment-based Gemini API key rather than anything hardcoded, so the same codebase can be pointed at a different key or environment without code changes.\n\n" +
      "The interesting part of building Jobi wasn't the chat UI itself so much as making a single-person, framework-free frontend feel as smooth as a heavier React/Vue chat app — getting markdown rendering, typing indicators, and error handling right with plain JavaScript takes more manual wiring than it would with a component framework, but keeps the project small and easy to reason about end to end.\n\n" +
      "Tech stack: Python, Flask, Google Gemini API, Flask-CORS, Gunicorn, HTML5, CSS3, JavaScript, Showdown.js, Render.",
    role: "Solo Developer",
    image: "/projects/jobi.png",
    tech: ["Python", "Flask", "JavaScript", "Gemini API", "Render"],
    links: {
      live: "https://jobi-ipet.onrender.com",
      github: "https://github.com/Amy23m/Jobi",
    },
    accentGradient:
      "linear-gradient(135deg, rgba(26,140,255,0.25), rgba(255,45,85,0.10))",
    span: "standard",
  },
];
