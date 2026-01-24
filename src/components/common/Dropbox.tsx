import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDown from "../../assets/icons/arrow_down.svg?react";
import ArrowUp from "../../assets/icons/arrow_up.svg?react";
import PlusIcon from "../../assets/icons/plus.svg?react";

type DropboxItem = {
  value: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

type DropboxState = "deactive" | "default" | "hovering" | "pressing" | "dropped";

interface DropboxProps {
  items?: DropboxItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const NEW_PROJECT_VALUE = "new";
// 나중에 경로 이름 맞춰서 변경 ‼️
const NEW_PROJECT_PATH = "/new-project";

const STATE_STYLE: Record<
  DropboxState,
  { triggerBg: string; text: string; icon: string }
> = {
  deactive: {
    triggerBg: "bg-grayscale-white",
    text: "text-system-deactive",
    icon: "text-system-deactive",
  },
  default: {
    triggerBg: "bg-grayscale-white",
    text: "text-grayscale-black",
    icon: "text-grayscale-black",
  },
  hovering: {
    triggerBg: "bg-grayscale-gy100",
    text: "text-grayscale-black",
    icon: "text-grayscale-black",
  },
  pressing: {
    triggerBg: "bg-grayscale-gy200",
    text: "text-grayscale-black",
    icon: "text-grayscale-black",
  },
  dropped: {
    triggerBg: "bg-grayscale-white",
    text: "text-grayscale-black",
    icon: "text-grayscale-black",
  },
};

export default function Dropbox({
  items = [],
  value,
  onValueChange,
  defaultValue,
  disabled = false,
  placeholder = "새 프로젝트",
  className = "",
}: DropboxProps) {
  const navigate = useNavigate();
  const isControlled = value !== undefined;

  const projectItems = useMemo(
    () => items.filter((it) => it.value !== NEW_PROJECT_VALUE),
    [items]
  );

  const dropdownItems = useMemo<DropboxItem[]>(
    () => [...projectItems, { value: NEW_PROJECT_VALUE, label: "새 프로젝트" }],
    [projectItems]
  );

  const firstEnabledValue = useMemo(() => {
    return projectItems.find((it) => !it.disabled)?.value ?? "";
  }, [projectItems]);

  const initialValue = useMemo(() => {
    if (defaultValue && defaultValue !== NEW_PROJECT_VALUE) return defaultValue;
    return firstEnabledValue;
  }, [defaultValue, firstEnabledValue]);

  const [internalValue, setInternalValue] = useState<string>(initialValue);
  const selectedValue = isControlled ? (value as string) : internalValue;

  const selectedItem = useMemo(() => {
    if (!selectedValue || selectedValue === NEW_PROJECT_VALUE) return undefined;
    return projectItems.find((it) => it.value === selectedValue);
  }, [projectItems, selectedValue]);

  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const triggerStatus =
    disabled ? "Deactive" : isPressing ? "Pressing" : isHovering ? "Hovering" : "Default";

  const state: DropboxState = (() => {
    if (disabled) return "deactive";
    if (isOpen) return "dropped";
    if (isPressing) return "pressing";
    if (isHovering) return "hovering";
    return "default";
  })();

  const styleByState = STATE_STYLE[state];

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen((p) => !p);
  };

  const handleSelect = (it: DropboxItem) => {
    if (disabled || it.disabled) return;

    if (it.value === NEW_PROJECT_VALUE) {
      it.onClick?.();
      setIsOpen(false);
      navigate(NEW_PROJECT_PATH);
      return;
    }

    it.onClick?.();

    if (!isControlled) setInternalValue(it.value);
    onValueChange?.(it.value);
    setIsOpen(false);
  };

  const triggerLabel = selectedItem?.label ?? placeholder;
  const labelBaseClass = "flex-1 justify-center text-base min-w-0 text-left text-h4-ko leading-6 line-clamp-1";

  return (
    <div
      className={[
        "w-full max-w-l inline-flex flex-col justify-start items-stretch gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* 펼치기 전 버튼? */}
      <div
        className={[
          "self-stretch",
          "bg-grayscale-white",
          "rounded-2xl",
          "flex flex-col justify-start items-start gap-1",
          "overflow-hidden",
        ].join(" ")}
      >
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={toggleOpen}
          onMouseEnter={() => !disabled && setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setIsPressing(false);
          }}
          onMouseDown={() => !disabled && setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          data-show-icon="true"
          data-show-profile="false"
          data-status={triggerStatus}
          className={[
            "self-stretch",
            "px-5 py-3",
            styleByState.triggerBg,
            "inline-flex justify-start items-start gap-2",
            "transition-colors duration-150 ease-in-out",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          <div
            className={[
              labelBaseClass,
              styleByState.text,
            ].join(" ")}
          >
            {triggerLabel}
          </div>

          <div className="w-6 h-6 relative overflow-hidden">
            {isOpen ? (
              <ArrowUp className={["w-6 h-6", styleByState.icon].join(" ")} aria-hidden="true" />
            ) : (
              <ArrowDown className={["w-6 h-6", styleByState.icon].join(" ")} aria-hidden="true" />
            )}
          </div>
        </button>
      </div>

      {/* 드롭다운 버튼 (펼친 후) */}
      {isOpen && (
        <div
          role="listbox"
          className={[
            "inline-flex flex-col justify-start items-start gap-2",
            "py-3",
            "bg-grayscale-white",
            "rounded-2xl",
            "shadow-ds-200",
          ].join(" ")}
        >
          {dropdownItems.map((it) => {
            const isNew = it.value === NEW_PROJECT_VALUE;
            const isSelected = !isNew && it.value === selectedValue;

            const itemStatus = it.disabled
              ? "Deactive"
              : isSelected
              ? "Selected"
              : "Default";

            return (
              <button
                key={it.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={it.disabled}
                onClick={() => handleSelect(it)}
                data-show-icon={isNew ? "true" : "false"}
                data-status={itemStatus}
                className={[
                  "self-stretch",
                  "px-5 py-3",
                  "bg-grayscale-white",
                  "inline-flex justify-start items-center",
                  "gap-2",
                  it.disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:bg-grayscale-gy100 active:bg-grayscale-gy200",
                  isSelected ? "bg-grayscale-gy100" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isNew ? (
                  <div className="w-6 h-6 relative overflow-hidden">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                ) : null}
                  {it.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
