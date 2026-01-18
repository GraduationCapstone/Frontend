import { forwardRef, useState } from "react";
import moreIcon from "../../../assets/icons/kebab.svg"; 

export type TestItemStatus = 'Untest' | 'Default';

export interface TestListItemSimpleProps extends React.HTMLAttributes<HTMLDivElement> {
  testId: string;      // T1234
  title: string;       // test
  coverage?: string;   // 70.7%
  duration?: string;   // 48s
  
  status?: TestItemStatus; 
  disabled?: boolean;      
  selected?: boolean;      
  onSelectChange?: (selected: boolean) => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

const TestListItemSimple = forwardRef<HTMLDivElement, TestListItemSimpleProps>(
  (
    {
      testId,
      title,
      coverage,
      duration,
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
    // 1. 내부 상태 관리 (Uncontrolled 지원)
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
    // - Untest/Disabled: Deactive (회색)
    // - Selected: Primary (초록색) -> Clicked 상태 반영
    // - Default: Black (검정색)
    const mainTextColor = disabled || isUntest
      ? "text-system-deactive"
      : isSelected
        ? "text-primary-sg600"
        : "text-grayscale-black";

    // 🎨 Sub Text Color (Coverage, Duration)
    // - Untest/Disabled: Deactive (회색)
    // - Default/Selected: Black (검정색) -> Clicked 상태여도 검정 유지
    const subTextColor = disabled || isUntest
      ? "text-system-deactive"
      : "text-grayscale-black";

    // 🎨 배경색 로직
    // - Selected: Secondary SG100 (민트색) -> Clicked 상태 반영
    // - Default: White + Hover(GY100) + Active(GY200)
    const backgroundClass = isSelected
      ? "bg-secondary-sg100"
      : `bg-grayscale-white ${(!disabled && !isUntest) ? "hover:bg-grayscale-gy100 active:bg-grayscale-gy200" : ""}`;

    // 메뉴 아이콘 투명도 (Untest일 때 흐리게)
    const iconOpacity = disabled || isUntest ? "opacity-40" : "opacity-100";

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
          group relative w-full inline-flex items-center gap-m px-gap-s py-gap-s
          border-b border-grayscale-gy300
          transition-colors duration-200
          
          /* ✨ 배경색 적용 (Selected or Default+Hover) */
          ${backgroundClass}
          
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}
        `}
        {...rest}
      >
        {/* 1. ID Column (w-24) */}
        <div className="w-24 px-gap-xxs flex justify-start items-center gap-2.5">
          <span className={`text-medium-ko ${mainTextColor}`}>
            {testId}
          </span>
        </div>

        {/* 2. Title Column (flex-1) */}
        <div className="flex-1 px-gap-xxs flex justify-center items-center gap-2.5">
          <span className={`flex-1 text-h3-ko line-clamp-1 ${mainTextColor}`}>
            {title}
          </span>
        </div>

        {/* 3. Coverage Column (w-32) */}
        <div className="w-32 px-gap-xxs flex justify-start items-center gap-2.5 overflow-hidden">
          <span className={`flex-1 text-medium-ko line-clamp-1 ${subTextColor} text-center`}>
            {coverage || "-"}
          </span>
        </div>

        {/* 4. Duration Column (w-32) */}
        <div className="w-32 px-gap-xxs flex justify-start items-center gap-2.5 overflow-hidden">
          <span className={`flex-1 text-medium-ko line-clamp-1 ${subTextColor} text-center`}>
            {duration || "-"}
          </span>
        </div>

        {/* 5. Menu Icon */}
        <div 
            className="p-1 rounded-lg flex justify-start items-center gap-xxs hover:bg-grayscale-gy100 transition-colors"
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

TestListItemSimple.displayName = "TestListItemSimple";
export default TestListItemSimple;