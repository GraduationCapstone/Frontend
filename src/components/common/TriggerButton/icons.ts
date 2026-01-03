import triggerDownUrl from "../../../assets/icons/triangle_down.svg";
import descUrl from "../../../assets/icons/desc.svg";

export const SELECT_TRIGGER_ICONS = {
  triggerDown: triggerDownUrl,
  desc: descUrl,
} as const;

export type SelectTriggerIconKey = keyof typeof SELECT_TRIGGER_ICONS;
