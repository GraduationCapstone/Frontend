// src/components/common/ProfileIcon.tsx

interface ProfileIconProps {
  /**
   * 활성화 여부
   * true: 초록색 (Primary-SG600)
   * false: 회색 (System-Deactive / Gray-400)
   */
  isActive?: boolean;
  
  /**
   * 내부에 들어갈 텍스트 (기본값: 'U')
   */
  initial?: string;

  /**
   * 추가 스타일 클래스 (크기, 마진 등)
   */
  className?: string;
}

export default function ProfileIcon({ isActive = true, initial = 'U', className = ''}: ProfileIconProps) {
  return (
    <div
      className={`
        /* 1. 크기 및 모양 (Figma 값 100% 일치) */
        w-9 h-9 
        rounded-[20px] 
        overflow-hidden 
        
        /* 2. 내부 텍스트 중앙 정렬 (Position Absolute 대신 Flexbox 사용 권장) */
        /* 이유: 글자가 바뀌어도 항상 정중앙에 오게 하기 위함입니다. */
        flex items-center justify-center
        
        /* 3. 배경색 분기 처리 */
        ${isActive ? 'bg-primary-sg600' : 'bg-grayscale-gy400'}

        /* 4. 외부 스타일 오버라이드 (마지막에 위치) */
        ${className}
      `}
    >
      {/* 내부 텍스트 */}
      <span 
        className="
          text-grayscale-white 
          font-semibold 
          text-[12px] 
          /* 여백(11.54px)을 맞추기 위해 텍스트 높이를 12.92px로 설정 */
          leading-[12.92px]
        "
      >
        {initial}
      </span>
    </div>
  );
}