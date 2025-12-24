import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonSize = "L" | "M" | "S";
export type ButtonVariant = "solid" | "solidStaticL" | "text";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: ReactNode;

  variant?: ButtonVariant;

  /**
   * solid: L/M 고정형, S 반응형
   * text : (underline 버튼) 반응형
   */
  size?: ButtonSize;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  /**
   * - widthClassName: w-full, w-s 같은 너비 관련 오버라이드
   */
  widthClassName?: string;
   /**
   * - paddingClassName: px/py 오버라이드
   */
  paddingClassName?: string;
   /**
   * - labelClassName: 텍스트 토큰 오버라이드
   */
  labelClassName?: string;

  className?: string;
}
