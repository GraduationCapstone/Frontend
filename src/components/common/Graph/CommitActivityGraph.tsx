import React from "react";

interface CommitActivityGraphProps {
  // 나중에 실제 데이터를 받을 때를 대비해 props 구조를 열어둡니다.
  data?: any[]; 
  className?: string;
}

export default function CommitActivityGraph({ className }: CommitActivityGraphProps) {
  return (
    // Figma 코드: w-60 h-20 (240px x 80px)
    <div className={`w-60 h-20 relative overflow-hidden ${className || ""}`}>
      {/* 그래프 예시 (Outline Box)
         Figma Class: outline-Colors-Primary-SG500 
         -> Project Tailwind Class: outline-primary-sg500 
      */}
      <div 
        className="
          absolute 
          w-44 h-9 
          left-[2.3125rem] top-[1.1875rem]
          outline outline-2 outline-offset-[-1px] outline-primary-sg500
        "
      >
        {/* 추후 이곳에 실제 bar/line chart가 들어갑니다 */}
      </div>
    </div>
  );
}