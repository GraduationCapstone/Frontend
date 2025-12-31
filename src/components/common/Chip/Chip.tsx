import type { ButtonHTMLAttributes, ReactNode } from "react";
import closeIcon from "../../../assets/icons/dismiss.svg";

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: ReactNode;
  leftSlot?: ReactNode;
  avatarText?: string; // 프로필 이미지 없어서 대체 U 글자
  paddingClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
};

type MaskIconProps = {
    src: string;
    className?: string;
  };
  
  function MaskIcon({ src, className }: MaskIconProps) {
    if (!src) return <span className={className}>×</span>;
  
    return (
      <span
        aria-hidden
        className={cn("shrink-0 bg-current", className)}
        style={{
          WebkitMaskImage: `url("${src}")`,
          maskImage: `url("${src}")`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    );
  }
  

export default function Chip({
  label,
  leftSlot,
  avatarText = "U",
  paddingClassName = "py-[0.25rem] pl-[0.63rem] pr-[0.5rem]",
  labelClassName,
  iconClassName,
  className,
  disabled,
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
    "inline-flex items-center min-w-0 rounded-[0.75rem] gap-[0.75rem] transition-colors duration-200 ease-in-out justify-center text-h4-eng text-grayscale-black";

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
        <span className="inline-flex items-center justify-center ">
          {leftSlot}
        </span>
      ) : (
        <span
          className={cn(
            "inline-flex w-5 h-5 aspect-square items-center justify-center rounded-full text-[0.75rem] font-semibold",
            disabled ? "bg-system-deactive text-grayscale-white" : "bg-primary-sg500 text-grayscale-white"
          )}
          aria-hidden
        >
          {avatarText}
        </span>
      )}
      {/* 길면 짜름 */}
      <span className={cn("min-w-0 truncate text-h3-eng", labelClassName)}>
        {label}
      </span>

      {/* 아이콘 */}
      <MaskIcon src={closeIcon} className={cn("w-6 h-6 text-grayscale-black", iconClassName)} />
    </button>
  );
}
