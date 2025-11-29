// src/components/common/Tab.tsx

interface TabProps {
  /** 탭에 표시될 텍스트 (예: "Tab") */
  label: string;
  
  /** * 선택된(Clicked) 상태 여부 
   * true: 밑줄 생성 + Primary-SG600 색상
   */
  isSelected?: boolean;
  
  /** * 비활성화(Deactivated) 여부
   * true: 회색 텍스트 + 클릭 불가
   */
  disabled?: boolean;
  
  /** 클릭 시 실행될 함수 */
  onClick?: () => void;
}

export default function Tab({ label, isSelected = false, disabled = false, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        /* 1. 레이아웃 & 크기 (68x40px) */
        /* px-5(20px) + py-2(8px) + border-b-2를 포함하여 레이아웃 고정 */
        px-5 py-2
        inline-flex justify-center items-center gap-2.5
        
        /* 2. 테두리 (Layout Shift 방지용) */
        /* 기본적으로 투명한 2px 테두리를 가지고 있다가, isSelected일 때만 색상 부여 */
        border-b-2
        ${isSelected && !disabled ? 'border-primary-sg600' : 'border-transparent'}
        
        /* 3. 텍스트 기본 스타일 (Pretendard, 16px, Semibold, Leading-6) */
        text-base font-semibold font-['Pretendard'] leading-6
        
        /* 4. 상태별 텍스트 색상 변화 (Transition) */
        transition-colors duration-200 ease-in-out
        
        /* State 1: Deactivated (비활성) */
        disabled:text-grayscale-gy400 disabled:cursor-not-allowed
        
        /* State 5: Clicked (선택됨) - 우선순위 높음 */
        ${isSelected && !disabled ? 'text-primary-sg600' : ''}
        
        /* State 2, 3, 4: Default / Hover / Pressing (비활성도 아니고, 선택되지도 않았을 때) */
        ${!isSelected && !disabled ? `
          text-grayscale-black        /* Default */
          hover:text-primary-sg550    /* Hovering */
          active:text-primary-sg600   /* Pressing */
        ` : ''}
      `}
    >
      {label}
    </button>
  );
}