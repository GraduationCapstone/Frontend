import { forwardRef, useState } from "react";
import CheckboxButton from "../CheckButton/CheckButton";
import Chip from "../Chip/Chip";

// 1. 아이콘 경로 import (프로젝트 구조 기반)
import starIcon from "../../../assets/icons/star.svg";
import forkIcon from "../../../assets/icons/fork.svg";
import issueIcon from "../../../assets/icons/issue_opened.svg"; // 추가됨
import prIcon from "../../../assets/icons/pull_request.svg";    // 추가됨
import dotIcon from "../../../assets/icons/dot.svg";

export interface RepositoryListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  isPublic?: boolean;
  language?: {
    name: string;
    color: string;
  };
  // 2. 통계 정보 타입 확장 (issues, pullRequests 추가)
  stats?: {
    forks?: number;
    stars?: number;
    issues?: number;       // Issue Opened
    pullRequests?: number; // Pull Request
  };
  updatedAt?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
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
      ...rest
    },
    ref
  ) => {
    // 내부 상태 관리 로직 (클릭 시 바로 초록색 체크박스 뜨게 함)
    const [internalSelected, setInternalSelected] = useState(false);
    const isControlled = selected !== undefined;
    const isSelected = isControlled ? selected : internalSelected;

    const handleToggle = (nextValue: boolean) => {
      if (disabled) return;
      if (!isControlled) setInternalSelected(nextValue);
      onSelectChange?.(nextValue);
    };

    // 스타일 변수
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
          group relative w-full inline-flex items-start gap-5 px-4 py-3
          bg-grayscale-white border-b border-grayscale-gy300
          transition-colors duration-200
          ${disabled 
            ? "cursor-not-allowed" 
            : "cursor-pointer hover:bg-grayscale-gy100 active:bg-grayscale-gy200"
          }
          ${className || ""}
        `}
        {...rest}
      >
        {/* Left: Checkbox */}
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

        {/* Right: Content */}
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

          {/* Footer Meta Info: 순서 재배치 */}
          {/* 순서: Language -> Fork -> Star -> Issue -> PR -> UpdatedAt */}
          <div className="flex flex-wrap items-center gap-2 overflow-hidden">
            
            {/* 1. Language */}
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

            {/* Separator */}
            {language && (
               <div className="w-1.5 h-1.5 flex items-center justify-center">
                 <img src={dotIcon} alt="dot" className={`w-[3px] h-[3px] ${disabled ? "opacity-40" : "brightness-50"}`} />
               </div>
            )}

            {/* 2. Fork */}
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

            {/* 3. Star */}
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

            {/* 4. Issue Opened (New) */}
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

            {/* 5. Pull Request (New) */}
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

            {/* 6. Updated At */}
            {updatedAt && (
              <span className={`text-regular-eng ${contentColor}`}>{updatedAt}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

RepositoryListItem.displayName = "RepositoryListItem";
export default RepositoryListItem;