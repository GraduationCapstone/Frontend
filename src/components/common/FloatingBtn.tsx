import arrowRight from '../../assets/icons/arrow_right.svg';

interface FloatingBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function FloatingBtn({ children, onClick, disabled }: FloatingBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      /* 아래 className 안에 오타가 없는지 확인하세요 */
      className="inline-flex items-center justify-center rounded-3xl shadow-ds-300 transition-all duration-200 ease-in-out pl-gap-m pr-gap-s py-gap-xs gap-1 text-h3-ko text-grayscale-white 
      
      /* 1. 기본(Default) 상태 */
      bg-grayscale-black 
      
      /* 2. 마우스 오버(Hover) 상태 */
      hover:bg-primary-sg550 
      
      /* 3. 누르는 중(Pressing) 상태 - Teal 색상 유지 */
      active:bg-primary-sg600 

      /* 4. 클릭 후(Clicked/Focus) 상태 - 기본 색상과 동일하게 강제 설정 */
      focus:bg-grayscale-black
      
      disabled:bg-grayscale-gy400 disabled:shadow-none disabled:cursor-not-allowed"
    >
      <span>{children}</span>

      <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden">
        <img 
          src={arrowRight} 
          alt="arrow" 
          className="h-4 w-2.5 object-contain"
        />
      </div>
    </button>
  );
}