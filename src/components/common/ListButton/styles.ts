import type { ListButtonVariant } from "./types";

export const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type ClassNames = {
  button: string;
  left: string;
  label: string;
  right: string;
  iconBox: string;
  avatar: string;
};

const VARIANT_BASE: Record<
  ListButtonVariant,
  { size: "M" | "S"; width: string; radius: string }
> = {
  staticWhiteMIconText: { size: "M", width: "w-s", radius: "rounded-[0.75rem]" },

  dynamicWhiteMImgTextIcon: { size: "M", width: "w-full", radius: "rounded-0" },
  dynamicWhiteMIconText: { size: "M", width: "w-full", radius: "rounded-0" },
  dynamicWhiteMSmoothIconText: { size: "M", width: "w-full", radius: "rounded-[0.75rem]" },

  dynamicWhiteSIconsText: { size: "S", width: "w-full", radius: "rounded-0" },
  dynamicWhiteSIconText: { size: "S", width: "w-full", radius: "rounded-0" },
};

const SIZE_STYLE = {
  M: {
    padding: "px-[1.25rem] py-[0.75rem]",
    gap: "gap-[0.75rem]",
    label: "text-h4-eng",
    icon: "w-[24px] h-[24px]",
    avatar: "w-[1.5rem] h-[1.5rem] text-[14px]",
  },
  S: {
    padding: "py-[0.5rem] px-[0.75rem]",
    gap: "gap-[0.5rem]",
    label: "text-regular-kr text-grayscale-black",
    icon: "w-[1.25rem] h-[1.25rem]",
    avatar: "w-[1.5rem] h-[1.5rem] text-[14px]",
  },
} as const;

const LIST_BUTTON_STATE = {
    deactive:
    "disabled:bg-grayscale-white disabled:text-system-deactive disabled:cursor-not-allowed " +
    "disabled:active:bg-grayscale-white",
    default: "bg-grayscale-white text-grayscale-black",
    hover: "hover:bg-grayscale-gy100",
    pressing: "active:bg-grayscale-gy200 text-grayscale-black",
    clicked: "focus:bg-white focus:text-[#111111] focus:outline-none",
} as const;

// M 사이즈 버튼용 (클릭 시 텍스트가 초록색으로 변경)
const LIST_BUTTON_STATE_M_CLICK_GREEN = {
    deactive:
    "disabled:bg-grayscale-white disabled:cursor-not-allowed " +
    "disabled:hover:bg-white disabled:active:bg-white",
    default: "bg-grayscale-white text-grayscale-black",
    hover: "hover:bg-grayscale-gy200 hover:text-grayscale-black",
    pressing: "active:bg-grayscale-gy200 active:text-grayscale-black",
    clicked: "focus:bg-grayscale-white focus:text-primary-sg600 focus:outline-none",
} as const;

const SELECTED_STATE = {
    deactive:
    "disabled:bg-grayscale-white disabled:text-system-deactive disabled:cursor-not-allowed " +
    "disabled:active:bg-grayscale-white",
    default: "bg-grayscale-white",
    hover: "hover:bg-grayscale-gy100",
    pressing: "active:bg-grayscale-gy200 text-grayscale-black",
    clicked: "focus:bg-grayscale-white focus:text-primary-sg600 focus:outline-none",
} as const;

// dynamicWhiteSIconsText는 selected 시에도 텍스트가 블랙
const SELECTED_STATE_BLACK_TEXT = {
    deactive:
    "disabled:bg-grayscale-white disabled:text-system-deactive disabled:cursor-not-allowed " +
    "disabled:active:bg-grayscale-white",
    default: "bg-grayscale-white text-grayscale-black",
    hover: "hover:bg-grayscale-gy100 hover:text-grayscale-black",
    pressing: "active:bg-grayscale-gy200 active:text-grayscale-black",
    clicked: "focus:bg-white focus:text-grayscale-black focus:outline-none",
} as const;

export const getListButtonClassNames = (args: {
  variant: ListButtonVariant;
  selected?: boolean;
  disabled?: boolean;
  hasTrailing?: boolean;
  className?: string;
}) => {
  const { variant, selected = false, disabled = false, hasTrailing = false, className } = args;

  const vb = VARIANT_BASE[variant];
  const sz = SIZE_STYLE[vb.size];

  let stateStyle;
  if (selected && variant === "dynamicWhiteSIconsText") {
    stateStyle = SELECTED_STATE_BLACK_TEXT;
  } else if (selected) {
    stateStyle = SELECTED_STATE;
  } else {
    // 버튼 중 클릭 시 초록색으로 바뀌는 것들
    const mClickGreenVariants: ListButtonVariant[] = [
      "staticWhiteMIconText",
      "dynamicWhiteMImgTextIcon",
      "dynamicWhiteMIconText",
      "dynamicWhiteMSmoothIconText",
    ];
    stateStyle = mClickGreenVariants.includes(variant)
      ? LIST_BUTTON_STATE_M_CLICK_GREEN
      : LIST_BUTTON_STATE;
  }

  const button = cn(
    "inline-flex items-center select-none outline-none",
    "duration-200",
    hasTrailing ? "justify-between" : "justify-start",
    vb.width,
    vb.radius,
    sz.padding,
    stateStyle.default,
    stateStyle.hover,
    stateStyle.pressing,
    stateStyle.clicked,
    stateStyle.deactive,
    disabled ? "cursor-not-allowed" : "cursor-pointer",
    className
  );

  const leftGap = sz.gap;

  return {
    button,
    left: cn("flex items-center", leftGap),
    label: cn("leading-none", sz.label),
    right: cn("shrink-0 flex items-center justify-center"),
    iconBox: cn("shrink-0 inline-block bg-current", sz.icon),
    avatar: cn(
      "shrink-0 rounded-full bg-primary-sg600 text-grayscale-white flex items-center justify-center",
      sz.avatar
    ),
  } satisfies ClassNames;
};


