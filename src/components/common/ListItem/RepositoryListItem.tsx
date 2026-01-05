import { forwardRef, useState, ReactNode } from "react";
import CheckboxButton from "../CheckButton/CheckButton";
import Chip from "../Chip/Chip";

// 아이콘 경로
import starIcon from "../../../assets/icons/star.svg";
import forkIcon from "../../../assets/icons/fork.svg";
import issueIcon from "../../../assets/icons/issue_opened.svg";
import prIcon from "../../../assets/icons/pull_request.svg";
import dotIcon from "../../../assets/icons/dot.svg";

export interface RepositoryListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  isPublic?: boolean;
  language?: {
    name: string;
    color: string;
  };
  stats?: {
    forks?: number;
    stars?: number;
    issues?: number;
    pullRequests?: number;
  };
  updatedAt?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
  activityGraph?: ReactNode;
}

const RepositoryListItem = forwardRef<HTMLDivElement, RepositoryListItemProps>(
  (
    {
      title,
      description,
      isPublic = true,
      language,
      stats,
      updatedAt,
      disabled = false,
      selected,
      onSelectChange,
      className,
      onClick,
      activityGraph,
      ...rest
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = useState(false);
    const isControlled = selected !== undefined;
    const isSelected = isControlled ? selected : internalSelected;

    const handleToggle = (nextValue: boolean) => {
      if (disabled) return;
      if (!isControlled) setInternalSelected(nextValue);
      onSelectChange?.(nextValue);
    };

    const titleColor = disabled ? "text-system-deactive" : "text-grayscale-black";
    const contentColor = disabled ? "text-system-deactive" : "text-grayscale-gy800";
    const iconOpacity = disabled ? "opacity-50 grayscale" : "opacity-100";

    return (
      <div
        ref={ref}
        role="button"
        aria-disabled={disabled}
        aria-selected={isSelected}
        onClick={(e) => {
          if (disabled) return;
          const target = e.target as HTMLElement;
          if (!target.closest('button')) {
            handleToggle(!isSelected);
          }
          onClick?.(e);
        }}
        className={`
          group relative 
          /* ✨ 수정: 너비 1260px, 패딩 py-4 (16px) 적용 -> 높이 112px 완성 */
          w-[1260px] px-5 py-4 
          
          inline-flex items-start gap-5 
          bg-grayscale-white border-b border-grayscale-gy300
          transition-colors duration-200
          
          /* Interaction States */
          ${disabled 
            ? "cursor-not-allowed" 
            : "cursor-pointer hover:bg-grayscale-gy100 active:bg-grayscale-gy200"
          }
          ${className || ""}
        `}
        {...rest}
      >
        {/* 1. Left: Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <CheckboxButton
            disabled={disabled}
            checked={isSelected}
            onCheckedChange={handleToggle}
            className={`
              ${disabled 
                ? "cursor-not-allowed" 
                : "group-hover:bg-grayscale-gy100 group-active:bg-grayscale-gy200" 
              }
            `}
          />
        </div>

        {/* 2. Middle: Main Content */}
        <div className="flex-1 flex flex-col items-start gap-2 min-w-0">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <span className={`text-h3-eng truncate ${titleColor}`}>
              {title}
            </span>
            {isPublic && (
              <Chip
                label="Public"
                disabled={disabled}
                className={disabled 
                    ? "outline-grayscale-gy300" 
                    : "outline-grayscale-gy300 text-grayscale-black"
                }
                paddingClassName="px-2 py-0.5"
                labelClassName="text-regular-eng"
              />
            )}
          </div>

          {/* Description */}
          {description && (
            <p className={`text-medium-eng line-clamp-2 ${contentColor}`}>
              {description}
            </p>
          )}

          {/* Footer Meta Info */}
          <div className="flex flex-wrap items-center gap-2 overflow-hidden">
            {language && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: disabled
                        ? "var(--color-system-deactive)"
                        : language.color,
                    }}
                  />
                </div>
                <span className={`text-regular-eng ${contentColor}`}>
                  {language.name}
                </span>
              </div>
            )}

            {language && (
               <div className="w-1.5 h-1.5 flex items-center justify-center">
                 <img src={dotIcon} alt="dot" className={`w-[3px] h-[3px] ${disabled ? "opacity-40" : "brightness-50"}`} />
               </div>
            )}

            {stats?.forks !== undefined && (
              <>
                <div className="flex items-center gap-0.5">
                   <div className="w-5 h-5 flex items-center justify-center">
                    <img src={forkIcon} alt="forks" className={`w-4 h-4 ${iconOpacity}`} />
                  </div>
                  <span className={`text-regular-eng ${contentColor}`}>{stats.forks}</span>
                </div>
                <div className="w-1.5 h-1.5 flex items-center justify-center">
                    <img src={dotIcon} alt="dot" className={`w-[3px] h-[3px] ${disabled ? "opacity-40" : "brightness-50"}`} />
                </div>
              </>
            )}

            {stats?.stars !== undefined && (
              <>
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src={starIcon} alt="stars" className={`w-4 h-4 ${iconOpacity}`} />
                  </div>
                  <span className={`text-regular-eng ${contentColor}`}>{stats.stars}</span>
                </div>
                <div className="w-1.5 h-1.5 flex items-center justify-center">
                    <img src={dotIcon} alt="dot" className={`w-[3px] h-[3px] ${disabled ? "opacity-40" : "brightness-50"}`} />
                </div>
              </>
            )}

            {stats?.issues !== undefined && (
              <>
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src={issueIcon} alt="issues" className={`w-4 h-4 ${iconOpacity}`} />
                  </div>
                  <span className={`text-regular-eng ${contentColor}`}>{stats.issues}</span>
                </div>
                <div className="w-1.5 h-1.5 flex items-center justify-center">
                    <img src={dotIcon} alt="dot" className={`w-[3px] h-[3px] ${disabled ? "opacity-40" : "brightness-50"}`} />
                </div>
              </>
            )}

            {stats?.pullRequests !== undefined && (
              <>
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src={prIcon} alt="PRs" className={`w-4 h-4 ${iconOpacity}`} />
                  </div>
                  <span className={`text-regular-eng ${contentColor}`}>{stats.pullRequests}</span>
                </div>
                <div className="w-1.5 h-1.5 flex items-center justify-center">
                    <img src={dotIcon} alt="dot" className={`w-[3px] h-[3px] ${disabled ? "opacity-40" : "brightness-50"}`} />
                </div>
              </>
            )}

            {updatedAt && (
              <span className={`text-regular-eng ${contentColor}`}>{updatedAt}</span>
            )}
          </div>
        </div>

        {/* 3. Right: Activity Graph Area */}
        <div className={`
            flex-shrink-0 
            w-60 h-20 
            relative overflow-hidden
            flex items-center justify-center
            ${disabled ? "opacity-50" : ""}
        `}>
          {activityGraph ? activityGraph : <div className="w-full h-full" />}
        </div>
      </div>
    );
  }
);

RepositoryListItem.displayName = "RepositoryListItem";
export default RepositoryListItem;