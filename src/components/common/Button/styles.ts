import type { ButtonProps, IconButtonProps, IconButtonVariant, IconOnlyButtonProps } from "./types";

export const cn = (...classes: Array<string | undefined | false>) =>
    classes.filter(Boolean).join(" ");
  type Size = NonNullable<ButtonProps["size"]>;

  type IconVariant = IconButtonVariant;

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

const ICON_BASE = {
    root: "inline-flex items-center justify-center rounded-xl gap-[0.5rem] pl-[0.75rem] pr-[1rem] py-[0.5rem] rounded-[0.75rem]",
    icon: "w-[1.5rem] h-[1.5rem] bg-current [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] " +
      "[webkit-mask-repeat:no-repeat] [webkit-mask-position:center] [webkit-mask-size:contain]",
    label: "text-h3-eng text-center",
  }
  const ICON_STATE: Record<
  IconVariant,
  { default: string; hover: string; pressing: string; clicked: string; deactive: string }
> = {
  download: {
    deactive:
    "disabled:bg-system-deactive disabled:text-grayscale-white disabled:cursor-not-allowed",
    default: "bg-grayscale-gy900 text-grayscale-white",
    hover: "hover:bg-primary-sg500 hover:text-grayscale-white",
    pressing: "active:bg-primary-sg550 active:text-grayscale-white",
    clicked: "focus:text-grayscale-white",
  },
  settings: {
    deactive:
      "disabled:bg-grayscale-white disabled:text-grayscale-gy500 disabled:cursor-not-allowed disabled:shadow-ds-200",
    default: "bg-grayscale-white text-grayscale-black shadow-ds-200",
    hover: "hover:bg-grayscale-gy100 hover:text-grayscale-black hover:shadow-ds-200",
    pressing: "active:bg-grayscale-gy200 active:text-grayscale-black active:shadow-ds-200",
    clicked: "focus:bg-grayscale-white focus:text-grayscale-black focus:shadow-ds-200",
  },
  profile: {
    deactive:
      "disabled:bg-transparent disabled:text-system-deactive disabled:cursor-not-allowed text-h4-eng",
    default: "bg-transparent text-grayscale-white text-h4-eng",
    hover: "hover:bg-[rgba(252,252,255,0.20)] hover:text-grayscale-white text-h4-eng",
    pressing: "active:bg-[rgba(252,252,255,0.30)] active:text-grayscale-white text-h4-eng",
    clicked: "focus:bg-transparent focus:text-primary-sg600 text-h4-eng",
  },
};

const ICON_ONLY_BASE = {
  root:
    "inline-flex p-[0.25rem] items-center gap-[0.5rem] rounded-[0.5rem] " +
    "transition-colors duration-200 ease-in-out " +
    "focus:outline-none focus-visible:outline-none",
  icon:
    "bg-current shrink-0 " +
    "[mask-repeat:no-repeat] [mask-position:center] [mask-size:contain] " +
    "[webkit-mask-repeat:no-repeat] [webkit-mask-position:center] [webkit-mask-size:contain]",
} as const;

const ICON_ONLY_STATE = {
  deactive:
    "disabled:bg-transparent disabled:text-system-deactive disabled:cursor-not-allowed " +
    "disabled:hover:bg-transparent disabled:active:bg-transparent",
  default: "bg-transparent text-grayscale-black",
  hover: "hover:bg-[rgba(31,35,40,0.05)]",
  pressing: "active:bg-[rgba(31,35,40,0.10)] active:text-grayscale-black",
  clicked: "focus:bg-transparent focus:text-grayscale-black",
} as const;


// ----------------------------------------

// BUTTON
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

// ICON BUTTON

export const getIconButtonClassNames = (
    props: Pick<
      IconButtonProps,
      "variant" | "className" | "widthClassName" | "paddingClassName" | "iconClassName" | "labelClassName"
    >
  ) => {
    const {
      variant = "download",
      className,
      widthClassName,
      paddingClassName,
      iconClassName,
      labelClassName,
    } = props;
  
    const state = ICON_STATE[variant];
    const rootBase = ICON_BASE.root;
    const iconBase = ICON_BASE.icon;
    const labelBase = ICON_BASE.label;
  
    return {
      root: cn(
        rootBase,
        state.default,
        state.hover,
        state.pressing,
        state.clicked,
        state.deactive,
        widthClassName,
        paddingClassName,
        className
      ),
      icon: cn(iconBase, iconClassName),
      label: cn(labelBase, labelClassName),
    };
  };

  // ICON ONLY BUTTON
  export const getIconOnlyButtonClassNames = (
    props: Pick<IconOnlyButtonProps, "className" | "iconClassName">
  ) => {
    const { className, iconClassName } = props;
  
    return {
      root: cn(
        ICON_ONLY_BASE.root,
        ICON_ONLY_STATE.default,
        ICON_ONLY_STATE.hover,
        ICON_ONLY_STATE.pressing,
        ICON_ONLY_STATE.clicked,
        ICON_ONLY_STATE.deactive,
        className
      ),
      icon: cn(ICON_ONLY_BASE.icon, iconClassName ?? "w-6 h-6"), // 1.5rem
    };
  };