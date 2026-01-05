import { forwardRef, useState } from "react";
import moreIcon from "../../../assets/icons/kebab.svg"; 

export type TestCodeStatus = 'Untest' | 'Pass' | 'Fail';

export interface TestCodeListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  codeId: string;
  title: string;
  status: TestCodeStatus;
  duration?: string;
  user?: string;
  /** 예: "2025-09-09 15:34" (공백으로 날짜/시간 구분) */
  date?: string; 
  disabled?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

const TestCodeListItem = forwardRef<HTMLDivElement, TestCodeListItemProps>(
  (
    {
      codeId,
      title,
      status,
      duration,
      user,
      date,
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
    // ... (상태 관리 로직 동일)
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

    // 🎨 상태별 스타일
    let chipBgColor = "";
    switch (status) {
      case 'Untest': chipBgColor = "bg-chip-untest"; break;
      case 'Pass': chipBgColor = "bg-chip-pass"; break;
      case 'Fail': chipBgColor = "bg-chip-fail"; break;
    }

    const mainTextColor = disabled 
      ? "text-system-deactive" 
      : isSelected 
        ? "text-primary-sg600" 
        : "text-grayscale-black";

    const subTextColor = disabled ? "text-system-deactive" : "text-grayscale-black";

    // 📅 날짜/시간 분리 로직
    const datePart = date ? date.split(" ")[0] : "-";
    const timePart = date ? date.split(" ")[1] : "";

    return (
      <div
        ref={ref}
        role="button"
        // ... (이벤트 핸들러 및 래퍼 클래스 동일)
        className={`
          group relative w-full inline-flex items-center gap-5 px-4 py-4
          border-b border-grayscale-gy300
          transition-colors duration-200
          bg-grayscale-white
          ${!disabled && "hover:bg-grayscale-gy100 active:bg-grayscale-gy200"}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}
        `}
        onClick={(e) => {
           if (!disabled) { handleToggle(); onClick?.(e); }
        }}
        {...rest}
      >
        {/* 1. ID */}
        <div className="w-24 px-2 flex justify-start items-center gap-2.5">
          <span className={`text-medium-eng ${mainTextColor}`}>{codeId}</span>
        </div>

        {/* 2. Title */}
        <div className="flex-1 px-2 flex justify-center items-center gap-2.5">
          <span className={`flex-1 text-h3-eng line-clamp-1 ${mainTextColor}`}>{title}</span>
        </div>

        {/* 3. Status */}
        <div className="w-32 px-2 inline-flex flex-col justify-start items-start gap-2.5">
          <div className={`px-3 py-1 rounded-3xl inline-flex justify-center items-center gap-2.5 ${chipBgColor}`}>
            <span className="text-medium-eng text-grayscale-white">{status}</span>
          </div>
        </div>

        {/* 4. Duration */}
        <div className="w-32 px-2 flex justify-start items-center gap-2.5 overflow-hidden">
          <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor} text-center`}>
            {isUntest ? "-" : duration}
          </span>
        </div>

        {/* 5. User */}
        <div className="w-32 px-2 flex justify-start items-center gap-2 overflow-hidden">
            {!isUntest && (
                <div className="w-6 h-6 relative bg-primary-sg600 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-grayscale-white leading-none mt-[1px]">U</span>
                </div>
            )}
            <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor} ${isUntest ? "text-center" : "text-left"}`}>
                {isUntest ? "-" : user}
            </span>
        </div>

        {/* 6. Date Column (수정됨: 옆으로 배치) */}
        <div className="w-48 px-2 flex justify-start items-center gap-2 overflow-hidden">
            {/* Untest일 경우 하이픈 하나만 중앙 정렬 */}
            {isUntest ? (
               <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor} text-center`}>-</span>
            ) : (
               <>
                 {/* 날짜 */}
                 <span className={`text-medium-eng ${subTextColor}`}>
                   {datePart}
                 </span>
                 {/* 시간 (gap-2로 떨어져서 표시됨) */}
                 {timePart && (
                   <span className={`flex-1 text-medium-eng line-clamp-1 ${subTextColor}`}>
                     {timePart}
                   </span>
                 )}
               </>
            )}
        </div>

        {/* 7. Action Icon */}
        <div 
            className="p-1 rounded-lg flex justify-start items-center gap-2 hover:bg-grayscale-gy100 transition-colors"
            onClick={(e) => { e.stopPropagation(); onMenuClick?.(e); }}
        >
            <div className="w-6 h-6 relative overflow-hidden flex items-center justify-center">
                <img src={moreIcon} alt="menu" className="w-6 h-6" />
            </div>
        </div>
      </div>
    );
  }
);

TestCodeListItem.displayName = "TestCodeListItem";
export default TestCodeListItem;