import type { SelectTriggerProps } from "./types";
import { SELECT_TRIGGER_ICONS } from "./icons";
import { getSelectTriggerClassNames, cn } from "./styles";

const MASK_ICON_BASE =
  "bg-current [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] " +
  "[webkit-mask-repeat:no-repeat] [webkit-mask-position:center] [webkit-mask-size:contain]";

function MaskIcon({ src, className }: { src?: string; className: string }) {
  if (!src) return null;

  return (
    <span
      aria-hidden="true"
      className={cn(MASK_ICON_BASE, className)}
      style={{
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
      }}
    />
  );
}

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
          <MaskIcon src={SELECT_TRIGGER_ICONS.desc} className={cx.icon} />
        )}

        <span className={cx.label}>{label}</span>
      </span>

      {/* 오른쪽 아이콘 고정 */}
      <MaskIcon src={SELECT_TRIGGER_ICONS.triggerDown} className={cx.icon} />
    </button>
  );
}
