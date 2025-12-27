import downloadSvg from "../../../assets/icons/download.svg";
import settingsSvg from "../../../assets/icons/setting.svg";
import profileSvg from "../../../assets/icons/person.svg";

import type { IconButtonVariant } from "./types";

export const ICON_SRC: Record<IconButtonVariant, string> = {
  download: downloadSvg,
  settings: settingsSvg,
  profile: profileSvg,
};
