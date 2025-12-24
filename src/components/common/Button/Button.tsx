import type { ButtonProps } from "./types";
import { getButtonClassNames } from "./styles";

export const Button = ({
  label,
  variant = "solid",
  size = "L",
  leftIcon,
  rightIcon,
  className,
  type,
  disabled,

  widthClassName,
  paddingClassName,
  labelClassName,

  ...rest
}: ButtonProps) => {
  const { root, label: labelCls } = getButtonClassNames({
    variant,
    size,
    className,
    widthClassName,
    paddingClassName,
    labelClassName,
  });

  return (
    <button type={type ?? "button"} disabled={disabled} className={root} {...rest}>
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span className={labelCls}>{label}</span>
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  );
};
