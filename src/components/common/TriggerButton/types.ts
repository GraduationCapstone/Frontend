import type { ButtonHTMLAttributes, ReactNode, FunctionComponent, SVGProps } from "react";

export type SelectTriggerVariant = "static" | "dynamic";

export interface SelectTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: ReactNode;
  variant?: SelectTriggerVariant;
  widthClassName?: string;
  paddingClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
  className?: string;
  leftIcon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}
