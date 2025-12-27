import type { IconButtonProps } from "./types";
import { ICON_SRC } from "./icons";
import { getIconButtonClassNames } from "./styles";

export default function IconButton(props: IconButtonProps) {
  const {
    variant = "download",
    label,
    ariaLabel,
    className,
    widthClassName,
    paddingClassName,
    iconClassName,
    labelClassName,
    type,
    ...rest
  } = props;

  const iconSrc = ICON_SRC[variant];
  console.log("iconSrc", iconSrc);

  const { root, icon, label: labelCn } = getIconButtonClassNames({
    variant,
    className,
    widthClassName,
    paddingClassName,
    iconClassName,
    labelClassName,
  });

  return (
    <button
      type={type ?? "button"}
      aria-label={ariaLabel}
      className={root}
      {...rest}
    > 
    <span
    className={icon}
    style={{
      WebkitMaskImage: `url("${iconSrc}")`,
      maskImage: `url("${iconSrc}")`,
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      WebkitMaskSize: "contain",
      maskSize: "contain",}}
    aria-hidden="true"/>
    <span className={labelCn}>{label}</span>
    </button>
  );
}