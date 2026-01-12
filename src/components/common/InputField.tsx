import { useEffect, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";

import SearchIcon from "../../assets/icons/search.svg?react";

type InputState = "deactive" | "default" | "typing" | "typed";

interface InputFieldProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  widthClass?: string;
  heightClass?: string;
  inputClassName?: string;
}

const InputField = ({
  placeholder = "placeholder",
  disabled = false,
  className = "",
  widthClass,
  heightClass,
  inputClassName = "",
}: InputFieldProps) => {
  const [value, setValue] = useState("");
  const [state, setState] = useState<InputState>(
    disabled ? "deactive" : "default"
  );

  useEffect(() => {
    if (disabled) setState("deactive");
    else setState(value.length > 0 ? "typed" : "default");
  }, [disabled, value.length]);

  const handleFocus = (_: FocusEvent<HTMLInputElement>) => {
    if (disabled) return;
    setState(value.length > 0 ? "typed" : "typing");
  };

  const handleBlur = (_: FocusEvent<HTMLInputElement>) => {
    if (disabled) return;
    setState(value.length > 0 ? "typed" : "default");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setValue(e.target.value);
    setState("typing");
  };

  const textStyle = {
    deactive: "text-system-deactive text-h4-kr",
    default: "text-grayscale-gy600 text-h4-kr",
    typing: "text-grayscale-black text-h4-kr",
    typed: "text-grayscale-black text-h4-kr",
  }[state];

  const iconColorClass = state === "deactive" ? "text-system-deactive" : "text-grayscale-black";

  const sizeClass = widthClass ?? "w-full min-w-0 max-w-[35.25rem]";
  const hClass = heightClass ?? "h-[3rem]";

  return (
    <div
      className={[
        "flex items-center rounded-[1rem] pl-[1.25rem] pr-[1rem] gap-[1.25rem] bg-grayscale-white",
        sizeClass,
        hClass,
        textStyle,
        className,
      ].join(" ")}
      style={{
        boxShadow: "inset 0 0 8px 0 rgba(31, 35, 40, 0.10)",
      }}
    >
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={[
          "flex-1 min-w-0 bg-transparent outline-none",
          disabled ? "cursor-not-allowed" : "",
          inputClassName,
        ].join(" ")}
      />
      <SearchIcon className={"shrink-0 w-[1.5rem] h-[1.5rem] ${iconColorClass} [&_*]:fill-current [&_*]:stroke-current"} />

    </div>
  );
};

export default InputField;
