import type { SelectTriggerProps } from "./types";
import { getSelectTriggerClassNames } from "./styles";
import DescIcon from "../../../assets/icons/desc.svg?react";
import TriggerDownIcon from "../../../assets/icons/triangle_down.svg?react";

export default function SelectTrigger({
  label,
  variant = "static",
  selected = false,
  widthClassName,
  paddingClassName,
  labelClassName,
  iconClassName,
  className,
  disabled,
  leftIcon: LeftIcon,
  ...rest
}: SelectTriggerProps) {
  const cx = getSelectTriggerClassNames({
    variant,
    selected,
    widthClassName,
    paddingClassName,
    labelClassName,
    iconClassName,
    className,
  });

  const svgColorClass = "[&_*]:fill-current";

  const IconComponent = LeftIcon || DescIcon;

  return (
    <button
      type="button"
      aria-haspopup="listbox"
      disabled={disabled}
      className={cx.root}
      {...rest}
    >
      <span className="inline-flex items-center gap-2 min-w-0 flex-1">
        {/* 왼쪽 아이콘 렌더링 */}
        {variant === "dynamic" && (
          <IconComponent 
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
