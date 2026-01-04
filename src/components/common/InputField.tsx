import { useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";

import searchIcon from "../../assets/icons/search.svg";

type InputState = "deactive" | "default" | "typing" | "typed";

interface InputFieldProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SearchIcon = ({ className = "" }: { className?: string }) => {
  return (
    <span
      aria-hidden
      className={`shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: `url("${searchIcon}")`,
        maskImage: `url("${searchIcon}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
};

const InputField = ({
  placeholder = "placeholder",
  disabled = false,
  className = "",
}: InputFieldProps) => {
  const [value, setValue] = useState("");
  const [state, setState] = useState<InputState>(
    disabled ? "deactive" : "default"
  );

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

  const iconStyle = state === "deactive" ? "text-gray-300" : "text-gray-500";

  return (
    <div
      className={[
        "flex items-center",
        // 반응형....
        "w-full max-w-[47rem] desktop:max-w-[35.25rem]]",
        "h-[3rem] pl-[1.25rem] pr-[1rem] gap-[1.25rem]",
        "rounded-[1rem] bg-grayscale-white",
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
          "flex-1 bg-transparent outline-none",
          disabled ? "cursor-not-allowed" : "",
        ].join(" ")}
      />

      <SearchIcon className={`w-[1.5rem] h-[1.5rem] ${iconStyle}`} />
    </div>
  );
};

export default InputField;
