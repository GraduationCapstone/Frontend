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
      "flex w-24 px-3 py-2 items-center gap-2 rounded-lg " + 
      "focus:text-primary-sg600",
    label: "text-medium500-ko",
  },
  dynamic: {
    root:
      "inline-flex w-full px-3 py-2 items-center justify-between gap-2 rounded-lg",
    label: "text-medium500-ko",
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
    | "selected"
  >
) => {
  const {
    variant = "static",
    className,
    widthClassName,
    paddingClassName,
    labelClassName,
    iconClassName,
    selected = false,
  } = props;

  const preset = PRESET[variant];

  const rootBase =
    "transition-colors ease-in-out focus-visible:outline-none";
  const labelBase = "min-w-0 truncate text-left";

  const selectedStyle = STATE_ROOT_COMMON.clicked.replace(/focus:/g, "");

  return {
    root: cn(
      rootBase,
      preset.root,
      widthClassName,
      paddingClassName,
      selected ? selectedStyle : STATE_ROOT_COMMON.default,
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

export const Btn_Static_Clear_S_Text_Icon = (
  props: Omit<Parameters<typeof getSelectTriggerClassNames>[0], "variant"> = {}
) => getSelectTriggerClassNames({ variant: "static", ...props });

export const Btn_Dynamic_Clear_S_Icons_Text = (
  props: Omit<Parameters<typeof getSelectTriggerClassNames>[0], "variant"> = {}
) => getSelectTriggerClassNames({ variant: "dynamic", ...props });
