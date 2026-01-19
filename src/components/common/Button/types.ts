import type * as React from "react";

export type ButtonVariant =
  | "staticGy900LText"
  | "staticGy900MText"
  | "dynamicSg500SText"
  | "dynamicClearSTextUnderlined";

export type IconButtonVariant =
  | "dynamicGy900MIconText"
  | "dynamicWhiteMDsIconText"
  | "dynamicClearSIconText";

export type IconOnlyButtonVariant = "staticClearXsIcon";

export type ButtonVariantAll = ButtonVariant | IconButtonVariant | IconOnlyButtonVariant;

export type SvgIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type NativeButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export type TextButtonProps = NativeButtonProps & {
  variant: ButtonVariant;
  children: React.ReactNode;
  label?: React.ReactNode;
  Icon?: never;
  iconPosition?: never;
  iconClassName?: never;
  ariaLabel?: never;
};

export type IconTextButtonProps = NativeButtonProps & {
  variant: IconButtonVariant;
  Icon?: SvgIconComponent;
  children?: React.ReactNode;
  label?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconClassName?: string;
  ariaLabel?: never;
};

export type IconOnlyButtonProps = NativeButtonProps & {
  variant: IconOnlyButtonVariant;
  Icon: SvgIconComponent;
  ariaLabel: string;
  children?: never;
  iconPosition?: never;
  iconClassName?: string;
};

export type ButtonProps = TextButtonProps | IconTextButtonProps | IconOnlyButtonProps;
