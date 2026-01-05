import { forwardRef, useState } from "react";
import dotIcon from "../../../assets/icons/dot.svg";

export interface ProjectListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  title: string;
  languages?: Array<{ name: string; color: string; }>;
  updatedAt?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
}

const ProjectListItem = forwardRef<HTMLDivElement, ProjectListItemProps>(
  (
    {
      code,
      title,
      languages,
      updatedAt,
      disabled = false,
      selected,
      onSelectChange,
      className,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = useState(false);
    const isControlled = selected !== undefined;
    const isSelected = isControlled ? selected : internalSelected;

    const handleToggle = () => {
      if (disabled) return;
      const nextValue = !isSelected;
      if (!isControlled) setInternalSelected(nextValue);
      onSelectChange?.(nextValue);
    };

    const textColorClass = disabled ? "text-system-deactive" : "text-grayscale-black";
    const subTextColorClass = disabled ? "text-system-deactive" : "text-grayscale-gy800";
    const dotColorClass = disabled ? "bg-system-deactive" : "bg-grayscale-gy800";

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
          group relative w-[912px] px-5 py-4 rounded-2xl 
          shadow-[0px_0px_12px_0px_rgba(31,35,40,0.10)]
          flex flex-col justify-start items-start gap-3
          transition-all duration-200
          bg-grayscale-white
          ${!disabled && "hover:bg-grayscale-gy100 active:bg-grayscale-gy200"}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}
        `}
        {...rest}
      >
        {/* 1. Top Row */}
        <div className="self-stretch flex justify-start items-center gap-5">
          {/* typography.css: text-large-eng (18px Medium) 사용 */}
          {/* 이전: text-[1.125rem] font-normal */}
          <span className={`text-large-eng ${textColorClass}`}>
            {code}
          </span>
          <div className="self-stretch p-1 flex flex-col justify-start items-start">
             <div className="w-0 flex-1 outline outline-1 outline-offset-[-0.50px] outline-grayscale-gy400"></div>
          </div>
          {/* typography.css: text-h3-eng (18px Semibold) 사용 */}
          {/* 이전: text-[1.125rem] font-semibold */}
          <span className={`text-h3-eng ${textColorClass}`}>
            {title}
          </span>
        </div>

        {/* 2. Bottom Row */}
        <div className="w-full flex justify-start items-center gap-2 overflow-hidden">
          {languages?.map((lang, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <div className="w-1.5 h-1.5 flex items-center justify-center">
                    <div className={`w-[3px] h-[3px] rounded-full ${dotColorClass}`}></div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: disabled ? "var(--color-system-deactive)" : lang.color }}
                  />
                </div>
                {/* typography.css: text-regular-eng (14px Medium) 사용 */}
                <span className={`text-regular-eng ${subTextColorClass}`}>
                  {lang.name}
                </span>
              </div>
            </div>
          ))}

          {languages && languages.length > 0 && updatedAt && (
            <div className="w-1.5 h-1.5 flex items-center justify-center">
                 <div className={`w-[3px] h-[3px] rounded-full ${dotColorClass}`}></div>
            </div>
          )}

          {updatedAt && (
            // typography.css: text-regular-eng (14px Medium) 사용
            <span className={`text-regular-eng ${subTextColorClass}`}>
              {updatedAt}
            </span>
          )}
        </div>
      </div>
    );
  }
);

ProjectListItem.displayName = "ProjectListItem";
export default ProjectListItem;