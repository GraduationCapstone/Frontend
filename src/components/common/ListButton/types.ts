import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { SvgIconComponent } from "../Button";

export type ListButtonVariant =
  | "staticWhiteMIconText"
  | "dynamicWhiteMImgTextIcon"
  | "dynamicWhiteMIconText"
  | "dynamicWhiteMSmoothIconText"
  | "dynamicWhiteSIconsText"
  | "dynamicWhiteSIconText";

export type ListButtonIconVariant = "plus" | "switch" | "check";
export type LisButtonIconOverrides = Partial<Record<ListButtonIconVariant, SvgIconComponent | null>>;

export type ListButtonLeading =
  | { type: "none" }
  | { type: "icon"; icon: ListButtonIconVariant; ariaLabel?: string }
  | { type: "icons"; icons: ListButtonIconVariant[]; ariaLabel?: string }
  | {
      type: "avatar";
      src?: string;
      alt?: string;
      fallbackText?: string;
      className?: string;
    };

export type ListButtonTrailing =
  | { type: "none" }
  | { type: "icon"; icon: ListButtonIconVariant; ariaLabel?: string };

export interface ListButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant: ListButtonVariant;
  label: ReactNode;
  leading?: ListButtonLeading;
  trailing?: ListButtonTrailing;
  selected?: boolean;
  className?: string;
  labelClassName?: string;
  leadingClassName?: string;
  trailingClassName?: string;
  icons?: LisButtonIconOverrides;
}
