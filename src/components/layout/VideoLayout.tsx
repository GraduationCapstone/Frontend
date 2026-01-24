import type { ReactNode } from "react";
import BackgroundImg from "../../assets/bg/BG.mp4";

type VideoLayoutVariant = "dark" | "light";

interface VideoLayoutProps {
  children: ReactNode;
  variant?: VideoLayoutVariant;
  className?: string;
  containerClassName?: string;
}

const VARIANT_STYLES: Record<VideoLayoutVariant, { root: string; overlay: string }> = {
  dark: {
    root: "bg-linear-to-b to-neutral-800/0",
    overlay: "bg-linear-to-b from-grayscale-black",
  },
  light: {
    root: "bg-linear-to-b to-white/0",
    overlay: "bg-gradient-to-b from-grayscale-white to-white/0",
  },
};

export default function VideoLayout({
  children,
  variant = "dark",
  className = "",
  containerClassName = "",
}: VideoLayoutProps) {
  const { root, overlay } = VARIANT_STYLES[variant];

  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden overscroll-none ${root} ${className}`}
    >
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          src={BackgroundImg}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className={`pointer-events-none absolute inset-0 -z-10 ${overlay}`} />
      <div
        className={`self-stretch w-full pt-16 relative flex min-h-screen flex-col items-center justify-start overflow-hidden ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
