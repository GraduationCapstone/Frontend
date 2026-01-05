import { forwardRef, useState } from "react";
import moreIcon from "../../../assets/icons/kebab.svg"; 

export type TestItemStatus = 'Untest' | 'Default';

export interface TestListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  testId: string;      
  title: string;       
  coverage?: string;   
  duration?: string;   
  user?: string;       
  date?: string;       
  
  status?: TestItemStatus; 
  disabled?: boolean;      
  selected?: boolean;      
  onSelectChange?: (selected: boolean) => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

const TestListItem = forwardRef<HTMLDivElement, TestListItemProps>(
  (
    {
      testId,
      title,
      coverage,
      duration,
      user,
      date,
      status = 'Default',
      disabled = false,
      selected,
      onSelectChange,
      className,
      onClick,
      onMenuClick,
      ...rest
    },
    ref
  ) => {
    // 1. 내부 상태 관리
    const [internalSelected, setInternalSelected] = useState(false);
    const isControlled = selected !== undefined;
    const isSelected = isControlled ? selected : internalSelected;

    const handleToggle = () => {
      if (disabled) return;
      const nextValue = !isSelected;
      if (!isControlled) setInternalSelected(nextValue);
      onSelectChange?.(nextValue);
    };

    // 2. 상태별 스타일 로직
    const isUntest = status === 'Untest';

    // 🎨 Main Text Color (ID, Title)
    // - Untest: Deactive (회색)
    // - Selected: Primary (초록색) -> Figma 코드 반영 (Clicked 상태)
    // - Default: Black (검정색)
    const mainTextColor = disabled || isUntest
      ? "text-system-deactive"
      : isSelected
        ? "text-primary-sg600"
        : "text-grayscale-black";

    // 🎨 Sub Text Color (나머지 정보는 선택되어도 검정색 유지)
    const subTextColor = disabled || isUntest
      ? "text-system-deactive"
      : "text-grayscale-black";

    // 🎨 User Icon Background
    const userIconBg = disabled || isUntest
      ? "bg-system-deactive"
      : "bg-primary-sg600";

    // 메뉴 아이콘 투명도
    const iconOpacity = disabled || isUntest ? "opacity-40" : "opacity-100";

    // 날짜/시간 분리
    const datePart = date ? date.split(" ")[0] : "-";
    const timePart = date ? date.split(" ")[1] : "";

    return (
      <div
        ref={ref}
        role="button"
        aria-disabled={disabled}
        aria-selected={isSelected}
        onClick={(e) => {
          if (!disabled) {
            handleToggle();
            onClick?.(e);
          }
        }}
        className={`
          group relative w-full inline-flex items-center gap-5 px-4 py-4
          border-b border-grayscale-gy300
          transition-colors duration-200
          
          /* 🎨 배경색 로직 */
          /* Complex 버전은 선택되어도 배경이 흰색입니다 (Simple과 다름) */
          bg-grayscale-white
          
          /* 🖱️ Interaction States */
          /* Untest나 Disabled가 아닐 때만 Hover/Active 효과 적용 */
          ${(!disabled && !isUntest) && "hover:bg-grayscale-gy100 active:bg-grayscale-gy200"}
          
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}
        `}
        {...rest}
      >
        {/* 1. ID Column */}
        <div className="w-24 px-2 flex justify-start items-center gap-2.5">
          <span className={`text-medium-eng ${mainTextColor}`}>
            {testId}
          </span>
        </div>

        {/* 2. Title Column */}
        <div className="flex-1 px-2 flex justify-center items-center gap-2.5">
          <span className={`flex-1 text-h3-eng line-clamp-1 ${mainTextColor}`}>
            {title}
          </span>
        </div>

        {/* 3. Coverage Column */}
        <div className="w-32 px-2 flex justify-start items-center gap-2.5 overflow-hidden">
          <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor} text-center`}>
            {coverage || "-"}
          </span>
        </div>

        {/* 4. Duration Column */}
        <div className="w-32 px-2 flex justify-start items-center gap-2.5 overflow-hidden">
          <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor} text-center`}>
            {duration || "-"}
          </span>
        </div>

        {/* 5. User Column */}
        <div className="w-32 px-2 flex justify-start items-center gap-2 overflow-hidden">
            <div className={`w-6 h-6 relative ${userIconBg} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center`}>
                <span className="text-[10px] font-bold text-grayscale-white leading-none mt-[1px]">U</span>
            </div>
            <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor}`}>
                {user || "-"}
            </span>
        </div>

        {/* 6. Date Column */}
        <div className="w-48 px-2 flex justify-start items-center gap-2 overflow-hidden">
           <span className={`text-medium-eng ${subTextColor}`}>
             {datePart}
           </span>
           {timePart && (
             <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor}`}>
               {timePart}
             </span>
           )}
        </div>

        {/* 7. Action Icon */}
        <div 
            className="p-1 rounded-lg flex justify-start items-center gap-2 hover:bg-grayscale-gy100 transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                onMenuClick?.(e);
            }}
        >
            <div className={`w-6 h-6 relative overflow-hidden flex items-center justify-center ${iconOpacity}`}>
                <img src={moreIcon} alt="menu" className="w-6 h-6" />
            </div>
        </div>
      </div>
    );
  }
);

TestListItem.displayName = "TestListItem";
export default TestListItem;