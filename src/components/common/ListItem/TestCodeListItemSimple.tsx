import { forwardRef, useState } from "react";
import moreIcon from "../../../assets/icons/kebab.svg"; 
import StatusBadge, { StatusBadgeType } from "../StatusBadge";

export type TestCodeStatus = 'Untest' | 'Pass' | 'Fail';

export interface TestCodeListItemSimpleProps extends React.HTMLAttributes<HTMLDivElement> {
  codeId: string;
  title: string;
  status: TestCodeStatus;
  duration?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

const TestCodeListItemSimple = forwardRef<HTMLDivElement, TestCodeListItemSimpleProps>(
  (
    {
      codeId,
      title,
      status,
      duration,
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
    // 1. 내부 상태 관리 (Uncontrolled 모드 지원)
    const [internalSelected, setInternalSelected] = useState(false);
    const isControlled = selected !== undefined;
    const isSelected = isControlled ? selected : internalSelected;

    const handleToggle = () => {
      if (disabled) return;
      const nextValue = !isSelected;
      if (!isControlled) setInternalSelected(nextValue);
      onSelectChange?.(nextValue);
    };

    const isUntest = status === 'Untest';

    const badgeTypeMap: Record<TestCodeStatus, StatusBadgeType> = {
      Untest: 'untestShort',
      Pass: 'passShort',
      Fail: 'failShort',
    };


    // 3. 텍스트 색상 로직 (Selected 상태 반영)
    const mainTextColor = disabled 
      ? "text-system-deactive" 
      : isSelected 
        ? "text-primary-sg600" // 선택됨: 진한 초록색
        : "text-grayscale-black"; // 기본: 검정색

    const subTextColor = disabled ? "text-system-deactive" : "text-grayscale-black";

    // 4. 배경색 로직 (Selected 상태 반영)
    // - Selected: bg-secondary-sg100 (연한 민트색)
    // - Default: bg-grayscale-white + Hover/Active 효과
    const backgroundClass = isSelected
      ? "bg-secondary-sg100" 
      : `bg-grayscale-white ${!disabled ? "hover:bg-grayscale-gy100 active:bg-grayscale-gy200" : ""}`;

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
          
          /* ✨ 배경색 적용 */
          ${backgroundClass}
          
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}
        `}
        {...rest}
      >
        {/* 1. ID Column */}
        <div className="w-24 px-gap-xxs flex justify-start items-center gap-2.5">
          <span className={`text-medium-eng ${mainTextColor}`}>
            {codeId}
          </span>
        </div>

        {/* 2. Title Column */}
        <div className="flex-1 px-gap-xxs flex justify-center items-center gap-2.5">
          <span className={`flex-1 text-h3-eng line-clamp-1 ${mainTextColor}`}>
            {title}
          </span>
        </div>

        {/* 3. Status Column */}
        <div className="w-32 px-gap-xxs inline-flex flex-col justify-start items-start gap-2.5">
          <StatusBadge type={badgeTypeMap[status]} />
        </div>

        {/* 4. Duration Column */}
        <div className="w-32 px-gap-xxs flex justify-start items-center gap-2.5 overflow-hidden">
          <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor} text-center`}>
            {isUntest ? "-" : duration}
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
            <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                <img src={moreIcon} alt="menu" className="w-6 h-6" />
            </div>
        </div>
      </div>
    );
  }
);

TestCodeListItemSimple.displayName = "TestCodeListItemSimple";
export default TestCodeListItemSimple;