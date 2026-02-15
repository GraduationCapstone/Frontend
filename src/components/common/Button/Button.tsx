import * as React from "react";
import type { ButtonProps, ButtonVariantAll, IconButtonVariant, IconOnlyButtonVariant, } from "./types";
import {
  getButtonLabelClassName,
  getButtonRootClassName,
  getIconButtonLabelClassName,
  getIconButtonRootClassName,
  getIconDefaultClassName,
  getIconOnlyButtonRootClassName,
} from "./styles";

const ICON_TEXT_VARIANTS: IconButtonVariant[] = [
  "dynamicGy900MIconText",
  "dynamicWhiteMDsIconText",
  "dynamicClearSIconText",
];

const ICON_ONLY_VARIANTS: IconOnlyButtonVariant[] = ["staticClearXsIcon"];

const isIconTextVariant = (v: ButtonVariantAll): v is IconButtonVariant =>
  (ICON_TEXT_VARIANTS as string[]).includes(v);

const isIconOnlyVariant = (v: ButtonVariantAll): v is IconOnlyButtonVariant =>
  (ICON_ONLY_VARIANTS as string[]).includes(v);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { variant, className, type = "button", ...rest } = props;

    // 아이콘만
    if (isIconOnlyVariant(variant)) {
      const { Icon, ariaLabel, iconClassName, ...btnRest } = rest as any;

      const rootClassName = getIconOnlyButtonRootClassName({ variant, className });
      const iconCls = getIconDefaultClassName(iconClassName);

      return (
        <button
          ref={ref}
          type={type}
          aria-label={ariaLabel}
          className={rootClassName}
          {...btnRest}
        >
          <Icon className={iconCls} />
        </button>
      );
    }
    // 아이콘 + 텍스트
    if (isIconTextVariant(variant)) {
      const { Icon, iconPosition = "left", iconClassName, children, label, ...btnRest } = rest as any;
      const content = children ?? label;

      const rootClassName = getIconButtonRootClassName({ variant, className });
      const labelClassName = getIconButtonLabelClassName(variant);
      const iconCls = getIconDefaultClassName(iconClassName);

      return (
        <button ref={ref} type={type} className={rootClassName} {...btnRest}>
          {iconPosition === "left" ? <Icon className={iconCls} /> : null}
          <span className={labelClassName}>{content}</span>
          {iconPosition === "right" ? <Icon className={iconCls} /> : null}
        </button>
      );
    }

    // 버튼
    const { children, label, ...btnRest } = rest as any;
    const content = children ?? label;

    const rootClassName = getButtonRootClassName({ variant, className });
    const labelClassName = getButtonLabelClassName(variant);

    return (
      <button ref={ref} type={type} className={rootClassName} {...btnRest}>
        <span className={labelClassName}>{content}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
