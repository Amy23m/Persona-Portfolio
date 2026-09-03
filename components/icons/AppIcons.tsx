import Image from "next/image";

type IconProps = {
  className?: string;
};

/** Hand-drawn sticker icon, floats gently and wiggles when its parent (.group) is hovered. */
function StickerIcon({ className, src, alt }: IconProps & { src: string; alt: string }) {
  return (
    <span
      className={`relative block h-full w-full animate-icon-float group-hover:[animation:icon-wiggle_0.5s_ease-in-out] ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="80px"
        className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
      />
    </span>
  );
}

/** Sticker icon used for the About Me app. */
export function AboutIcon(props: IconProps) {
  return <StickerIcon {...props} src="/icons/about.png" alt="About Me" />;
}

/** Sticker icon used for the Experience app. */
export function ExperienceIcon(props: IconProps) {
  return <StickerIcon {...props} src="/icons/experience.png" alt="Experience" />;
}

/** Sticker icon used for the Projects app. */
export function ProjectsIcon(props: IconProps) {
  return <StickerIcon {...props} src="/icons/projects.png" alt="Projects" />;
}

/** Sticker icon used for the Connect app. */
export function ConnectIcon(props: IconProps) {
  return <StickerIcon {...props} src="/icons/connect.png" alt="Connect" />;
}

/** Sticker icon used for the Music Player app. */
export function MusicIcon(props: IconProps) {
  return <StickerIcon {...props} src="/projects/icon4.png" alt="Music Player" />;
}
