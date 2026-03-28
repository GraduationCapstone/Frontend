import { forwardRef, useEffect, useState } from "react";
import DotIcon from "../../../assets/icons/dot.svg?react";

export interface ProjectListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  title: string;
  hostName: string;
  hostProfileImageUrl: string;
  languages?: Array<{ name: string; color?: string; }>;
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
      hostName,
      hostProfileImageUrl,
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
    const [hostAvatarError, setHostAvatarError] = useState(false);
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
    const hostInitial = hostName.trim().charAt(0).toUpperCase() || "H";

    useEffect(() => {
      setHostAvatarError(false);
    }, [hostProfileImageUrl]);
    
    // dotColorClass는 이제 이미지로 대체되어 제거하거나, 
    // 이미지가 색상 제어가 안 된다면 opacity로 비활성화 느낌을 줄 수 있습니다.
    const dotOpacityClass = disabled ? "opacity-30" : "opacity-100";

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
          group relative
          w-full max-w-xl
          px-gap-m py-gap-s rounded-2xl
          shadow-ds-200
          flex flex-col justify-start items-start gap-xs
          transition-all duration-200
          bg-grayscale-white
          ${!disabled && "hover:bg-grayscale-gy100 active:bg-grayscale-gy200"}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${className || ""}
        `}
        {...rest}
      >
        {/* 1. Top Row */}
        <div className="self-stretch flex items-center justify-between gap-5">
          <div className="min-w-0 flex flex-1 items-center gap-gap-m">
            <span className={`shrink-0 text-large400-ko ${textColorClass}`}>
              {code}
            </span>
            <div className="self-stretch p-1 flex flex-col justify-start items-start">
              <div className="w-0 flex-1 outline-1 outline-offset-[-0.50px] outline-grayscale-gy400"></div>
            </div>
            <span className={`min-w-0 truncate text-h3-ko ${textColorClass}`}>
              {title}
            </span>
          </div>

          {/* {호스트 닉네임/프로필 표시} */}
          <div className="px-2 py-1 rounded-lg inline-flex justify-center items-center gap-2.5 bg-secondary-sg100">
            <div className="text-center justify-center text-medium500-ko text-primary-sg600">호스트</div>
            <div className="inline-flex justify-start items-center gap-3">
              <div
                className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                {hostProfileImageUrl && !hostAvatarError ? (
                  <img
                    src={hostProfileImageUrl}
                    alt={`${hostName} profile`}
                    className="w-full h-full object-cover"
                    onError={() => setHostAvatarError(true)}
                  />
                ) : (
                  // 프로필 없을 때라 하드코딩
                  <span className="text-[10px] font-semibold leading-none text-grayscale-white">{hostInitial}</span>
                )}
              </div>

              <div className="truncate text-center justify-center text-h4-ko text-grayscale-black">{hostName}</div>
            </div>
          </div>
        </div>

        {/* 2. Bottom Row */}
        <div className="w-full flex justify-start items-center gap-gap-xxs overflow-hidden">
          {languages?.map((lang, index) => (
            <div key={index} className="flex items-center gap-xxs">
              {index > 0 && (
                <div className={`w-2 h-2 flex items-center justify-center ${dotOpacityClass}`} aria-label="dot">
                  <DotIcon className="w-[6px] h-[6px]" />
                </div>
              )}
              
              <div className="flex items-center gap-gap-xxs">
                <div className="w-5 h-5 flex items-center justify-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      disabled ? "bg-system-deactive" : "bg-blue-600"
                    }`}
                  />
                </div>
                <span className={`text-regular-ko ${subTextColorClass}`}>
                  {lang.name}
                </span>
              </div>
            </div>
          ))}

          {/* ✨ 수정됨: 날짜 앞 구분점도 dotIcon 사용 */}
          {languages && languages.length > 0 && updatedAt && (
            <div className={`w-2 h-2 flex items-center justify-center ${dotOpacityClass}`} aria-label="dot">
              <DotIcon className="w-[6px] h-[6px]" />
            </div>
          )}

          {updatedAt && (
            <span className={`text-regular-ko ${subTextColorClass}`}>
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