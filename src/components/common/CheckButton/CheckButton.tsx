import React, { useMemo, useState } from "react";
import BoxIcon from "../../../assets/icons/box.svg?react";
import CheckedIcon from "../../../assets/icons/checkbox.svg?react";

export type SvgIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type IconSet = {
  box: SvgIconComponent;
  checked: SvgIconComponent;
};

export interface CheckboxButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  ariaLabel?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;

  disabled?: boolean;

  iconClassName?: string;
  labelClassName?: string;
  className?: string;

  icons?: Partial<IconSet>;
}

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export default function CheckboxButton({
  ariaLabel = "checkbox",
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  iconClassName,
  labelClassName,
  className,
  icons,

  onClick: userOnClick,
  onKeyDown: userOnKeyDown,
  onPointerEnter: userOnPointerEnter,
  onPointerLeave: userOnPointerLeave,
  onPointerDown: userOnPointerDown,
  onPointerUp: userOnPointerUp,
  onPointerCancel: userOnPointerCancel,

  ...rest
}: CheckboxButtonProps) {
  const ICONS: IconSet = {
    box: icons?.box ?? BoxIcon,
    checked: icons?.checked ?? CheckedIcon,
  };

  const isControlled = typeof checked === "boolean" && typeof onCheckedChange === "function";
  const [innerChecked, setInnerChecked] = useState<boolean>(defaultChecked ?? false);
  const isChecked = isControlled ? (checked as boolean) : innerChecked;

  const [isHover, setIsHover] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const Icon = useMemo(() => {
    return isChecked ? ICONS.checked : ICONS.box;
  }, [isChecked, ICONS.box, ICONS.checked]);

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInnerChecked(next);
    onCheckedChange?.(next);
  };

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    toggle();
    userOnClick?.(e);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (!disabled && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      toggle();
    }
    userOnKeyDown?.(e);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-label={ariaLabel}
      aria-checked={isChecked}
      aria-disabled={disabled ? true : undefined}
      disabled={disabled}
      className={cn(
        "inline-flex p-[0.25rem] items-center gap-[0.5rem] rounded-[0.5rem] bg-grayscale-white",
        !disabled && isHover && "bg-grayscale-gy100 text-grayscale-gy400",
        !disabled && isPressing && "bg-grayscale-gy200 text-grayscale-gy400",
        disabled && "text-system-deactive cursor-not-allowed bg-grayscale-white",
        !disabled && "text-grayscale-gy400 bg-grayscale-white",
        !disabled && isChecked && "text-primary-sg500",
        className
      )}
      {...rest}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerEnter={(e) => {
        setIsHover(true);
        userOnPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setIsHover(false);
        setIsPressing(false);
        userOnPointerLeave?.(e);
      }}
      onPointerDown={(e) => {
        setIsPressing(true);
        userOnPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        setIsPressing(false);
        userOnPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        setIsPressing(false);
        userOnPointerCancel?.(e);
      }}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "shrink-0 w-6 h-6",
          "[&_*]:fill-current [&_*]:stroke-current",
          iconClassName
        )}
      />
      {labelClassName ? <span className={labelClassName} /> : null}
    </button>
  );
}

export function Btn_Static_Checkbox(props: CheckboxButtonProps) {
  return <CheckboxButton {...props} />;
}
Btn_Static_Checkbox.displayName = "Btn_Static/Checkbox";
