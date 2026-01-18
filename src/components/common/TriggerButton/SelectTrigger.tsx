import type { SelectTriggerProps } from "./types";
import { getSelectTriggerClassNames, cn } from "./styles";
import DescIcon from "../../../assets/icons/desc.svg?react";
import TriggerDownIcon from "../../../assets/icons/triangle_down.svg?react";

export default function SelectTrigger({
  label,
  variant = "static",
  widthClassName,
  paddingClassName,
  labelClassName,
  iconClassName,
  className,
  disabled,
  ...rest
}: SelectTriggerProps) {
  const cx = getSelectTriggerClassNames({
    variant,
    widthClassName,
    paddingClassName,
    labelClassName,
    iconClassName,
    className,
  });

  const svgColorClass = "[&_*]:fill-current [&_*]:stroke-current";

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      disabled={disabled}
      className={cx.root}
      {...rest}
    >
      <span className="inline-flex items-center gap-2 min-w-0">
        {/* 왼쪽 아이콘 고정 */}
        {variant === "dynamic" && (
          <DescIcon 
          aria-hidden="true"
          className={[cx.icon, svgColorClass].filter(Boolean).join(" ")}
        />
        )}

        <span className={cx.label}>{label}</span>
      </span>

      {/* 오른쪽 아이콘 고정 */}
      <TriggerDownIcon
        aria-hidden="true"
        className={[cx.icon, svgColorClass].filter(Boolean).join(" ")}
      />
    </button>
  );
}
