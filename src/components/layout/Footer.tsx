// src/components/layout/Footer.tsx

interface FooterProps {
  variant?: 'default' | 'gray';
}

export default function Footer({ variant = 'default' }: FooterProps) {
  return (
    <footer
      className={`
        w-full 
        h-[60px] 
        px-10
        flex 
        items-center 
        justify-start 
        gap-14
        ${variant === 'gray' ? 'bg-grayscale-gy100' : 'bg-transparent'}
      `}
    >
      <p className="
        font-['Pretendard'] 
        text-xs 
        font-medium 
        leading-[18px] /* Figma와 동일하게 18px로 설정 */
        text-grayscale-gy700 
        text-center
      ">
        Copyright © 2025 Team Probe. All rights reserved.
      </p>
    </footer>
  );
}