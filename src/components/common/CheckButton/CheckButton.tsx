import React, { useMemo, useState } from "react";
import boxIconUrl from "../../../assets/icons/box.svg";
import checkedIconUrl from "../../../assets/icons/checkbox.svg";

type IconSet = {
  box: string;
  checked: string;
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
  renderMode?: "mask" | "img";
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
  renderMode = "mask",
  ...rest
}: CheckboxButtonProps) {
  const ICONS: IconSet = {
    box: icons?.box ?? boxIconUrl,
    checked: icons?.checked ?? checkedIconUrl,
  };

  const isControlled = typeof checked === "boolean";
  const [innerChecked, setInnerChecked] = useState<boolean>(defaultChecked ?? false);
  const isChecked = isControlled ? (checked as boolean) : innerChecked;

  const [isHover, setIsHover] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const iconSrc = useMemo(() => {
    if (disabled) return isChecked ? ICONS.checked : ICONS.box;
    if (isPressing) return ICONS.checked;
    return isChecked ? ICONS.checked : ICONS.box;
  }, [disabled, isChecked, isPressing, ICONS.box, ICONS.checked]);

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInnerChecked(next);
    onCheckedChange?.(next);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-label={ariaLabel}
      aria-checked={isChecked}
      aria-disabled={disabled ? true : undefined}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => {
        setIsHover(false);
        setIsPressing(false);
      }}
      onPointerDown={() => setIsPressing(true)}
      onPointerUp={() => setIsPressing(false)}
      onPointerCancel={() => setIsPressing(false)}
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
    >
      {renderMode === "img" ? (
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          className={cn("shrink-0", iconClassName ?? "w-6 h-6")} // 1.5rem
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "bg-current shrink-0",
            "[mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]",
            "[webkit-mask-repeat:no-repeat] [webkit-mask-position:center] [webkit-mask-size:contain]",
            iconClassName ?? "w-6 h-6"
          )}
          style={{
            WebkitMaskImage: `url("${iconSrc}")`,
            maskImage: `url("${iconSrc}")`,
          }}
        />
      )}
    </button>
  );
}
