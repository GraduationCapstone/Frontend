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
  
  /** (추가됨) 외부에서 값을 제어하기 위한 Prop */
  value?: string;
  /** (추가됨) 값이 변경될 때 실행될 함수 */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** (추가됨) 검색 아이콘 표시 여부 (기본값: true) */
  showIcon?: boolean;
}

const InputField = ({
  placeholder = "placeholder",
  disabled = false,
  className = "",
  widthClass,
  heightClass,
  inputClassName = "",

  value: externalValue, // 외부에서 주입된 값
  onChange,             // 외부 변경 함수
  showIcon = true,      // 아이콘 표시 여부
}: InputFieldProps) => {
  // 외부 값이 있으면 그것을 쓰고, 없으면 내부 상태 사용
  const isControlled = externalValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  
  const value = isControlled ? externalValue : internalValue;
  
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
    // 제어 컴포넌트가 아닐 때만 내부 상태 업데이트
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    // 부모에게 변경 알림
    onChange?.(e);
    setState("typing");
  };

  const textStyle = {
    deactive: "text-system-deactive text-h4-ko",
    default: "text-grayscale-gy600 text-h4-ko",
    typing: "text-grayscale-black text-h4-ko",
    typed: "text-grayscale-black text-h4-ko",
  }[state];

  const iconColorClass = state === "deactive" ? "text-system-deactive" : "text-grayscale-black";

  const sizeClass = widthClass ?? "w-full min-w-0 max-w-[35.25rem]";
  const hClass = heightClass ?? "h-[3rem]";

  return (
    <div
      className={[
        "flex items-center rounded-[1rem] pl-[1.25rem] pr-[1rem] gap-[1.25rem] bg-grayscale-white",
        "shadow-is-100",
        sizeClass,
        hClass,
        textStyle,
        className,
      ].join(" ")}
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
      {showIcon && (
        <SearchIcon className={`shrink-0 w-[1.5rem] h-[1.5rem] ${iconColorClass} [&_*]:fill-current [&_*]:stroke-current`} />
      )}
    </div>
  );
};

export default InputField;
