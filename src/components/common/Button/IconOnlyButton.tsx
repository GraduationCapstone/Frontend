import type { IconOnlyButtonProps } from "./types";
import { getIconOnlyButtonClassNames } from "./styles";

export default function IconOnlyButton({
  ariaLabel,
  iconSrc,
  className,
  iconClassName,
  disabled,
  ...rest
}: IconOnlyButtonProps) {
  const classes = getIconOnlyButtonClassNames({ className, iconClassName });

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className={classes.root}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={classes.icon}
        style={{
          WebkitMaskImage: `url("${iconSrc}")`,
          maskImage: `url("${iconSrc}")`,
        }}
      />
    </button>
  );
}
