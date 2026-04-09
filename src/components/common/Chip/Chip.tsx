import type { ButtonHTMLAttributes, ReactNode } from "react";
import CloseIcon from "../../../assets/icons/dismiss.svg?react";
import DefaultProfileImg from "../../../assets/profile/default_profile.webp";
import DeactiveProfileImg from "../../../assets/profile/deactive_profile.webp";
const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: ReactNode;
  leftSlot?: ReactNode;
  src?: string;
  paddingClassName?: string;
  labelClassName?: string;
  iconClassName?: string;

  onRemove?: () => void;
};

export default function Chip({
  label,
  leftSlot,
  src,
  paddingClassName = "py-1 pl-2.5 pr-2",
  labelClassName,
  iconClassName,
  className,
  disabled,
  onRemove,
  ...rest
}: ChipProps) {
  const STATE_ROOT = {
    deactive:
      "disabled:bg-grayscale-white disabled:cursor-not-allowed disabled:shadow-ds-100 disabled:text-system-deactive",
    default: "bg-grayscale-white shadow-ds-100",
    hover: "hover:bg-grayscale-gy100 hover:shadow-ds-100",
    pressing: "active:bg-grayscale-gy200 active:shadow-ds-100",
    clicked: "focus:bg-grayscale-white focus:shadow-ds-100",
  } as const;

  const baseRoot =
    "inline-flex items-center min-w-0 rounded-xl gap-4 transition-colors duration-200 ease-in-out justify-center text-h4-ko text-grayscale-black";
  const fallbackProfileSrc = disabled ? DeactiveProfileImg : DefaultProfileImg;
  const profileSrc = src ?? fallbackProfileSrc;

    return (
      <button
        type="button"
        disabled={disabled}
        className={cn(
          baseRoot,
          paddingClassName,
          STATE_ROOT.default,
          STATE_ROOT.hover,
          STATE_ROOT.pressing,
          STATE_ROOT.clicked,
          STATE_ROOT.deactive,
          className
        )}
        {...rest}
      >
        {/* 프로필 */}
        {leftSlot ? (
          <span className="inline-flex items-center justify-center">{leftSlot}</span>
          ) : (
          // src가 없으면 assets/profile 기본 이미지를 사용
          <img
            src={profileSrc}
            alt="profile"
            className={cn(
              "inline-flex w-6 h-6 aspect-square items-center justify-center rounded-full object-cover shrink-0",
              disabled && "opacity-50" // disabled 일 땐 이미지도 살짝 투명하게
            )}
            onError={(e) => {
              const image = e.currentTarget;
              if (image.dataset.fallbackApplied !== "true") {
                image.dataset.fallbackApplied = "true";
                image.src = fallbackProfileSrc;
                return;
              }
              image.style.display = "none";
            }}
          />
        )}
  
        {/* 길면 짜름 */}
        <span className={cn("min-w-0 truncate text-h4-ko", labelClassName)}>
          {label}
        </span>
  
        {/* 닫기 아이콘 */}
        {onRemove ? (
          <span
            onClick={(e) => {
              if (disabled) return;
              e.stopPropagation();
              onRemove();
            }}
            className={cn(
              "shrink-0 w-6 h-6 rounded-lg inline-flex items-center justify-center",
            )}
          >
            <CloseIcon
              aria-hidden="true"
              className={cn(
                "shrink-0 w-6 h-6",
                "[&_*]:fill-current",
                iconClassName
              )}
            />
          </span>
        ) : null}
      </button>
    );
  }

export function Btn_Dynamic_GY100_XS_IMG_Text_Icon(props: ChipProps) {
  return <Chip {...props} />;
}
Btn_Dynamic_GY100_XS_IMG_Text_Icon.displayName = "Btn_Dynamic/GY100_XS/IMG_Text_Icon";
