import type { ButtonProps } from "./types";

export const cn = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");
  
  type Size = NonNullable<ButtonProps["size"]>;

const SOLID_STATE_DEFAULT = {
  default: "bg-grayscale-gy900 text-grayscale-white",
  hover: "hover:bg-primary-sg500",
  pressing: "active:bg-primary-sg550 active:text-grayscale-white",
  clicked: "focus:bg-grayscale-gy900 focus:text-grayscale-white",
  deactive:
    "disabled:bg-system-deactive disabled:text-grayscale-white disabled:cursor-not-allowed",
} as const;

const SOLID_STATE_STATIC_L = {
    default: "bg-grayscale-gy900 text-grayscale-white",
    hover: "hover:bg-grayscale-gy900 hover:text-primary-sg400",
    pressing: "active:bg-primary-sg500 active:text-grayscale-black",
    clicked: "focus:bg-primary-gy900 focus:text-grayscale-white",
    deactive:
      "disabled:bg-system-deactive disabled:text-grayscale-white disabled:cursor-not-allowed",
  } as const;


const SOLID_PRESET: Record<Size, { root: string; label: string }> = {
  L: {
    root: "flex w-l py-3 rounded-[1rem] shadow-ds-200 gap-2.5",
    label: "text-h2-eng",
  },
  M: {
    root: "flex w-s py-[0.5rem] rounded-[0.75rem] shadow-ds-200 gap-2.5",
    label: "text-h3-eng text-grayscale-white",
  },
  S: {
    root: "inline-flex px-[0.5rem] py-[1rem] rounded-[0.5rem] gap-2.5",
    label: "text-h4-eng text-grayscale-white",
  },
};

const TEXT_PRESET = {
    root: "inline-flex px-[1.25rem] py-[0.5rem] rounded-[0.5rem] gap-2.5 bg-transparent",
    label:
      "text-medium-eng text-grayscale-black underline decoration-current underline-offset-auto",
  } as const;

  const TEXT_STATE_ROOT = {
    hover: "hover:bg-[rgba(31,35,40,0.05)]",
    pressing: "active:bg-[rgba(31,35,40,0.10)]",
    deactive:
      "disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:bg-transparent",
  } as const;

  const pickSolidState = (variant: ButtonProps["variant"], size: Size) => {
    if (variant === "solidStaticL" && size === "L") return SOLID_STATE_STATIC_L;
    return SOLID_STATE_DEFAULT;
  };

  export const getButtonClassNames = (
    props: Pick<
      ButtonProps,
      | "variant"
      | "size"
      | "className"
      | "widthClassName"
      | "paddingClassName"
      | "labelClassName"
    >
  ) => {
    const {
      variant = "solid",
      size = "L",
      className,
      widthClassName,
      paddingClassName,
      labelClassName,
    } = props;
  
    const baseRoot =
      "items-center justify-center font-sans transition-colors duration-200 ease-in-out";
    const baseLabel = "text-center justify-center";
  
    if (variant === "text") {
      return {
        root: cn(
          baseRoot,
          TEXT_PRESET.root,
          TEXT_STATE_ROOT.hover,
          TEXT_STATE_ROOT.pressing,
          TEXT_STATE_ROOT.deactive,
          widthClassName,
          paddingClassName,
          className
        ),
        label: cn(baseLabel, TEXT_PRESET.label, labelClassName),
      };
    }
  
    const preset = SOLID_PRESET[size];
    const state = pickSolidState(variant, size);
  
    return {
      root: cn(
        baseRoot,
        preset.root,
        state.default,
        state.hover,
        state.pressing,
        state.clicked,
        state.deactive,
        widthClassName,
        paddingClassName,
        className
      ),
      label: cn(baseLabel, preset.label, labelClassName),
    };
  };