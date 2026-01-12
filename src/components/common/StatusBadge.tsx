export type StatusBadgeType =
  | "pass"
  | "passShort"
  | "block"
  | "blockShort"
  | "fail"
  | "failShort"
  | "untest"
  | "untestShort";

export interface StatusBadgeProps {
  type: StatusBadgeType;
  className?: string;
}

const BADGE_TEXT: Record<StatusBadgeType, string> = {
  pass: "Pass",
  passShort: "P",
  block: "Block",
  blockShort: "B",
  fail: "Fail",
  failShort: "F",
  untest: "Untest",
  untestShort: "U",
};

const BADGE_STYLE: Record<StatusBadgeType, string> = {
  pass: "bg-chip-pass text-grayscale-white",
  passShort: "bg-chip-pass text-grayscale-white",

  block: "bg-chip-block text-grayscale-white",
  blockShort: "bg-chip-block text-grayscale-white",

  fail: "bg-chip-fail text-grayscale-white",
  failShort: "bg-chip-fail text-grayscale-white",

  untest: "bg-chip-untest text-grayscale-white",
  untestShort: "bg-chip-untest text-grayscale-white",
};

export default function StatusBadge({ type, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "px-[0.75rem] py-[0.25rem] gap-[0.625rem]",
        "rounded-[1.5rem] whitespace-nowrap",
        "text-medium-eng",
        BADGE_STYLE[type],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {BADGE_TEXT[type]}
    </span>
  );
}
