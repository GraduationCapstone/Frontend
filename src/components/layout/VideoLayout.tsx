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
    root: "",
    overlay: "bg-gradient-to-b from-grayscale-white to-grayscale-white/0",
  },
  light: {
    root: "",
    overlay: "bg-gradient-to-b from-grayscale-white to-grayscale-white/0",
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
      className={`relative h-screen w-full overflow-hidden overscroll-none ${root} ${className}`}
    >
      <div className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden">
        <video
          className="h-screen w-screen object-cover"
          src={BackgroundImg}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className={`pointer-events-none fixed left-0 top-0 z-0 h-[1080px] w-screen ${overlay}`} />
      <div
        className={`relative z-10 flex h-screen w-full snap-y snap-mandatory flex-col items-center justify-start overflow-y-auto overflow-x-hidden overscroll-y-contain scroll-pt-[160px] pt-16 ${containerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
