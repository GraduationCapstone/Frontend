import type { ButtonHTMLAttributes, ReactNode } from "react";
import CloseIcon from "../../../assets/icons/dismiss.svg?react";

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: ReactNode;
  leftSlot?: ReactNode;
  avatarText?: string; // 프로필 이미지 없어서 대체 U 글자
  paddingClassName?: string;
  labelClassName?: string;
  iconClassName?: string;

  onRemove?: () => void;
};

export default function Chip({
  label,
  leftSlot,
  avatarText = "U",
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
          <span
            className={cn(
              "inline-flex w-6 h-6 aspect-square items-center justify-center rounded-full text-[0.75rem] font-semibold",
              disabled
                ? "bg-system-deactive text-grayscale-white"
                : "bg-primary-sg500 text-grayscale-white"
            )}
            aria-hidden
          >
            {avatarText}
          </span>
        )}
  
        {/* 길면 짜름 */}
        <span className={cn("min-w-0 truncate text-h3-ko", labelClassName)}>
          {label}
        </span>
  
        {/* 닫기 아이콘 */}
        <button
        type="button"
        disabled={disabled || !onRemove}
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className={cn(
          "shrink-0 w-6 h-6 rounded-lg inline-flex items-center justify-center",
        )}
      >
        <CloseIcon
          aria-hidden="true"
          className={cn(
            "shrink-0 w-6 h-6",
            "[&_*]:fill-current [&_*]:stroke-current",
            iconClassName
          )}
        />
        </button>
      </button>
    );
  }

export function Btn_Dynamic_GY100_XS_IMG_Text_Icon(props: ChipProps) {
  return <Chip {...props} />;
}
Btn_Dynamic_GY100_XS_IMG_Text_Icon.displayName = "Btn_Dynamic/GY100_XS/IMG_Text_Icon";