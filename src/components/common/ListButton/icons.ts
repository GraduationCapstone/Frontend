import plusSvg from "../../../assets/icons/plus.svg";
import switchSvg from "../../../assets/icons/switch.svg";
import checkSvg from "../../../assets/icons/check.svg";

import type { ListButtonIconVariant } from "./types";

export const PlusIcon = plusSvg;
export const SwitchIcon = switchSvg;
export const CheckIcon = checkSvg;

/** src lookup */
export const ICON_SRC: Record<ListButtonIconVariant, string> = {
  plus: PlusIcon,
  switch: SwitchIcon,
  check: CheckIcon,
};
