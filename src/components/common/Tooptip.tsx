interface TooltipProps {
    label?: string;
    // 퍼센트 API 받아오면 그대로 출력
    value?: number;
    // 기본값 00%
    digits?: number;
    className?: string;
  }
  export default function Tooltip({
    label = "N",
    value,
    digits = 2,
    className = "",
  }: TooltipProps) {
    const safeValue =
      typeof value === "number" && Number.isFinite(value) ? value : 0;
  
    const clamped = Math.max(0, Math.min(100, Math.round(safeValue)));
    const formatted = String(clamped).padStart(digits, "0");
  
    return (
      <div
        className={[
          "inline-flex items-center justify-center",
          "px-[1rem] py-[0.5rem] gap-[0.5rem]",
          "rounded-[0.75rem]",
          "bg-grayscale-white",
          "text-medium-ko text-grayscale-black",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          boxShadow: "0 0 6px 0 rgba(31, 35, 40, 0.10)",
        }}
      >
        <span className="whitespace-nowrap">{label}</span>
        <span className="whitespace-nowrap">{formatted}%</span>
      </div>
    );
  }
  