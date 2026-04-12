// src/components/layout/Footer.tsx

interface FooterProps {
  variant?: 'default' | 'gray';
}

export default function Footer({ variant = 'default' }: FooterProps) {
  return (
    <footer
      className={`
        w-full 
        h-[3.75rem]
        px-layout-margin
        flex 
        items-center 
        justify-start 
        gap-14
        ${variant === 'gray' ? 'bg-grayscale-gy100' : 'bg-transparent'}
      `}
    >
      <p className="text-small500-ko text-grayscale-gy700 text-center">
        Copyright © 2026 Team Probe. All rights reserved.
      </p>
    </footer>
  );
}