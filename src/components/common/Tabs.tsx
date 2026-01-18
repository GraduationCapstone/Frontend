import { useMemo, useState } from "react";
import Tab from "./Tab";

export type TabsItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface TabsProps {
  items: TabsItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  listClassName?: string;
}

export default function Tabs({
  items,
  value,
  onValueChange,
  defaultValue,
  className = "",
  listClassName = "",
}: TabsProps) {
  const firstEnabledValue = useMemo(() => {
    return items.find((it) => !it.disabled)?.value ?? items[0]?.value ?? "";
  }, [items]);

  const validDefaultValue = useMemo(() => {
    if (!defaultValue) return "";
    const ok = items.some((it) => it.value === defaultValue && !it.disabled);
    return ok ? defaultValue : "";
  }, [defaultValue, items]);

  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string>(
    validDefaultValue || firstEnabledValue
  );

  const selectedValue = isControlled ? (value as string) : internalValue;

  const handleSelect = (nextValue: string, disabled?: boolean) => {
    if (disabled) return;

    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <div
        className={[
          "self-stretch inline-flex justify-start items-center border-b border-grayscale-gy300 gap-3",
          listClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {items.map((it) => {
          const selected = it.value === selectedValue;

          return (
            <Tab
              key={it.value}
              label={it.label}
              disabled={it.disabled}
              isSelected={selected}
              onClick={() => handleSelect(it.value, it.disabled)}
            />
          );
        })}
      </div>
    </div>
  );
}
