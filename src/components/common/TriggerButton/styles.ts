import type { SelectTriggerProps, SelectTriggerVariant } from "./types";

export const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const STATE_ROOT_COMMON = {
  deactive:
    "disabled:text-system-deactive disabled:cursor-not-allowed",
  default: "text-grayscale-black",
  hover: "hover:bg-[rgba(31,35,40,0.05)] hover:text-grayscale-black",
  pressing: "active:bg-[rgba(31,35,40,0.10)]",
  clicked: "focus:bg-grayscale-white focus:text-grayscale-black",
} as const;

const PRESET: Record<SelectTriggerVariant, { root: string; label: string }> = {
  static: {
    root:
      "flex w-[6.25rem] px-[0.75rem] py-[0.5rem] items-center gap-[0.5rem] rounded-[0.5rem] " + 
      "focus:text-primary-sg600",
    label: "text-medium-eng",
  },
  dynamic: {
    root:
      "inline-flex w-full px-[0.5rem] py-[0.75rem] items-center justify-between gap-[0.5rem] rounded-[0.5rem]",
    label: "text-medium-eng",
  },
};

export const getSelectTriggerClassNames = (
  props: Pick<
    SelectTriggerProps,
    | "variant"
    | "className"
    | "widthClassName"
    | "paddingClassName"
    | "labelClassName"
    | "iconClassName"
  >
) => {
  const {
    variant = "static",
    className,
    widthClassName,
    paddingClassName,
    labelClassName,
    iconClassName,
  } = props;

  const preset = PRESET[variant];

  const rootBase =
    "transition-colors ease-in-out focus-visible:outline-none";
  const labelBase = "min-w-0 truncate text-left";

  return {
    root: cn(
      rootBase,
      preset.root,
      widthClassName,
      paddingClassName,
      STATE_ROOT_COMMON.default,
      STATE_ROOT_COMMON.hover,
      STATE_ROOT_COMMON.pressing,
      STATE_ROOT_COMMON.clicked,
      STATE_ROOT_COMMON.deactive,
      className
    ),
    label: cn(labelBase, preset.label, labelClassName),
    icon: cn("w-[1.25rem] h-[1.25rem] shrink-0", iconClassName),
  };
};
