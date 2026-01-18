import type { ButtonVariant, IconButtonVariant, IconOnlyButtonVariant } from "./types";

export const cn = (...values: Array<string | undefined | null | false>) =>
  values.filter(Boolean).join(" ");

// Btn_Static/GY900_L/Text (고정형)
const BTN_STATIC_GY900_L_TEXT_STATE = {
  default: "bg-grayscale-gy900 text-grayscale-white",
  hover: "hover:bg-grayscale-gy900 hover:text-primary-sg400",
  pressing: "active:bg-primary-sg500 active:text-grayscale-black",
  clicked: "focus:bg-primary-gy900 focus:text-grayscale-white",
  deactive:
    "disabled:bg-system-deactive disabled:text-grayscale-white disabled:cursor-not-allowed",
} as const;

// Btn_Static/GY900_M/Text (고정형)
const BTN_STATIC_GY900_M_TEXT_STATE = {
  default: "bg-grayscale-gy900 text-grayscale-white",
  hover: "hover:bg-primary-sg500",
  pressing: "active:bg-primary-sg550 active:text-grayscale-white",
  clicked: "focus:bg-grayscale-gy900 focus:text-grayscale-white",
  deactive:
    "disabled:bg-system-deactive disabled:text-grayscale-white disabled:cursor-not-allowed",
} as const;

// Btn_Dynamic/SG500_S/Text (반응형)
const BTN_DYNAMIC_SG500_S_TEXT_STATE = {
  default: "bg-grayscale-gy900 text-grayscale-white",
  hover: "hover:bg-primary-sg500",
  pressing: "active:bg-primary-sg550 active:text-grayscale-white",
  clicked: "focus:bg-grayscale-gy900 focus:text-grayscale-white",
  deactive:
    "disabled:bg-system-deactive disabled:text-grayscale-white disabled:cursor-not-allowed",
} as const;

const BTN_DYNAMIC_CLEAR_S_TEXT_UNDERLINED_STATE_ROOT = {
  hover: "hover:bg-[rgba(31,35,40,0.05)]",
  pressing: "active:bg-[rgba(31,35,40,0.10)]",
  deactive:
    "disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:bg-transparent disabled:text-system-deactive",
} as const;

const BUTTON_PRESET: Record<ButtonVariant, { root: string; label: string }> = {
  staticGy900LText: {
    root:
      "inline-flex items-center justify-center gap-2.5 rounded-2xl py-3 outline-none shadow-ds-200 w-l",
    label: "text-h2-kr text-center",
  },
  staticGy900MText: {
    root:
      "inline-flex items-center justify-center gap-2.5 rounded-xl py-2 outline-none shadow-ds-200 w-s",
    label: "text-h3-kr",
  },
  dynamicSg500SText: {
    root:
      "inline-flex items-center justify-center gap-2.5 rounded-lg px-4 py-2 outline-none",
    label: "text-h4-kr",
  },
  dynamicClearSTextUnderlined: {
    root: "inline-flex px-5 py-2 rounded-lg gap-2.5 bg-transparent",
    label:
      "text-medium-eng underline decoration-current underline-offset-auto",
      // typo 수정 후 맞추기 ⭐️⭐️⭐️⭐️⭐️⭐️
  },
};

const BUTTON_STATE: Record<
  Exclude<ButtonVariant, "dynamicClearSTextUnderlined">,
  { default: string; hover: string; pressing: string; clicked: string; deactive: string }
> = {
  staticGy900LText: BTN_STATIC_GY900_L_TEXT_STATE,
  staticGy900MText: BTN_STATIC_GY900_M_TEXT_STATE,
  dynamicSg500SText: BTN_DYNAMIC_SG500_S_TEXT_STATE,
};

export const getButtonRootClassName = (args: {
  variant: ButtonVariant;
  className?: string;
}) => {
  const { variant, className } = args;

  const preset = BUTTON_PRESET[variant];

  if (variant === "dynamicClearSTextUnderlined") {
    return cn(
      preset.root,
      BTN_DYNAMIC_CLEAR_S_TEXT_UNDERLINED_STATE_ROOT.hover,
      BTN_DYNAMIC_CLEAR_S_TEXT_UNDERLINED_STATE_ROOT.pressing,
      BTN_DYNAMIC_CLEAR_S_TEXT_UNDERLINED_STATE_ROOT.deactive,
      className
    );
  }

  const st = BUTTON_STATE[variant];
  return cn(
    preset.root,
    st.default,
    st.hover,
    st.pressing,
    st.clicked,
    st.deactive,
    className
  );
};

export const getButtonLabelClassName = (variant: ButtonVariant) => {
  return BUTTON_PRESET[variant].label;
};

// Btn_Dynamic/GY900_M/Icon_Text (반응형)
const ICONBTN_DYNAMIC_GY900_M_ICON_TEXT_STATE = {
  deactive:
    "disabled:bg-system-deactive disabled:text-grayscale-white disabled:cursor-not-allowed",
  default: "bg-grayscale-gy900 text-grayscale-white",
  hover: "hover:bg-primary-sg500 hover:text-grayscale-white",
  pressing: "active:bg-primary-sg550 active:text-grayscale-white",
  clicked: "focus:text-grayscale-white",
} as const;

// Btn_Dynamic/White_M_DS/Icon_Text (반응형)
const ICONBTN_DYNAMIC_WHITE_M_DS_ICON_TEXT_STATE = {
  deactive:
    "disabled:bg-grayscale-white disabled:text-grayscale-gy500 disabled:cursor-not-allowed disabled:shadow-ds-200",
  default: "bg-grayscale-white text-grayscale-black shadow-ds-200",
  hover: "hover:bg-grayscale-gy100 hover:text-grayscale-black hover:shadow-ds-200",
  pressing: "active:bg-grayscale-gy200 active:text-grayscale-black active:shadow-ds-200",
  clicked: "focus:bg-grayscale-white focus:text-grayscale-black focus:shadow-ds-200",
} as const;

// Btn_Dynamic/Clear_S/Icon_Text (반응형)
const ICONBTN_DYNAMIC_CLEAR_S_ICON_TEXT_STATE = {
  deactive:
    "disabled:bg-transparent disabled:text-system-deactive disabled:cursor-not-allowed",
  default: "bg-transparent text-grayscale-white",
  hover:
    "hover:bg-[rgba(252,252,255,0.20)] hover:text-grayscale-white",
  pressing:
    "active:bg-[rgba(252,252,255,0.30)] active:text-grayscale-white",
  clicked: "focus:bg-transparent focus:text-primary-sg600",
} as const;

const ICONBUTTON_PRESET: Record<IconButtonVariant, { root: string; label: string }> = {
  dynamicGy900MIconText: {
    root:
      "inline-flex items-center justify-center gap-2 rounded-xl pl-3 pr-4 py-2 outline-none",
    label: "text-h3-kr",
  },
  dynamicWhiteMDsIconText: {
    root:
      "inline-flex items-center justify-center gap-2 rounded-xl pl-3 pr-4 py-2 outline-none shadow-ds-200",
    label: "text-h3-kr",
  },
  dynamicClearSIconText: {
    root:
      "inline-flex items-center justify-center gap-2 rounded-lg pl-3 pr-4 py-2 outline-none",
    label: "text-h4-kr",
  },
};

const ICONBUTTON_STATE: Record<
  IconButtonVariant,
  { default: string; hover: string; pressing: string; clicked: string; deactive: string }
> = {
  dynamicGy900MIconText: ICONBTN_DYNAMIC_GY900_M_ICON_TEXT_STATE,
  dynamicWhiteMDsIconText: ICONBTN_DYNAMIC_WHITE_M_DS_ICON_TEXT_STATE,
  dynamicClearSIconText: ICONBTN_DYNAMIC_CLEAR_S_ICON_TEXT_STATE,
};

export const getIconButtonRootClassName = (args: {
  variant: IconButtonVariant;
  className?: string;
}) => {
  const { variant, className } = args;
  const preset = ICONBUTTON_PRESET[variant];
  const st = ICONBUTTON_STATE[variant];

  return cn(
    preset.root,
    st.default,
    st.hover,
    st.pressing,
    st.clicked,
    st.deactive,
    className
  );
};

export const getIconButtonLabelClassName = (variant: IconButtonVariant) => {
  return ICONBUTTON_PRESET[variant].label;
};

export const getIconDefaultClassName = (iconClassName?: string) => {
  return cn("shrink-0 w-6 h-6 fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current", iconClassName);
};

// Btn_Static/Clear_XS/Icon (고정형)
const ICONONLYBTN_STATIC_CLEAR_XS_ICON_STATE = {
  deactive:
    "disabled:bg-transparent disabled:text-system-deactive disabled:cursor-not-allowed " +
    "disabled:hover:bg-transparent disabled:active:bg-transparent",
  default: "bg-transparent text-grayscale-black",
  hover: "hover:bg-[rgba(31,35,40,0.05)]",
  pressing: "active:bg-[rgba(31,35,40,0.10)] active:text-grayscale-black",
  clicked: "focus:bg-transparent focus:text-grayscale-black",
} as const;

const ICONONLY_PRESET: Record<IconOnlyButtonVariant, { root: string }> = {
  staticClearXsIcon: {
    root: "inline-flex items-center justify-center outline-none p-1 rounded-lg gap-2",
  },
};

const ICONONLY_STATE: Record<
  IconOnlyButtonVariant,
  { default: string; hover: string; pressing: string; clicked: string; deactive: string }
> = {
  staticClearXsIcon: ICONONLYBTN_STATIC_CLEAR_XS_ICON_STATE,
};

export const getIconOnlyButtonRootClassName = (args: {
  variant: IconOnlyButtonVariant;
  className?: string;
}) => {
  const { variant, className } = args;
  const preset = ICONONLY_PRESET[variant];
  const st = ICONONLY_STATE[variant];

  return cn(
    preset.root,
    st.default,
    st.hover,
    st.pressing,
    st.clicked,
    st.deactive,
    className
  );
};
