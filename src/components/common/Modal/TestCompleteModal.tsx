import { ReactNode } from "react";
import dismissIcon from "../../../assets/icons/dismiss.svg";
import { Button, IconOnlyButton } from "../Button";

interface SimpleModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  /** 본문 텍스트 데이터 (왼쪽 라벨, 오른쪽 값) */
  items?: { label: string; value: string }[];
}

export default function SimpleModal({
  title = "Header",
  isOpen,
  onClose,
  onConfirm,
  items = [
    { label: "Text", value: "00s" },
    { label: "Text", value: "00s" },
  ],
}: SimpleModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop (옵션: 배경이 필요하다면 추가)
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Modal Container */}
      <div
        className={`
          w-overlay-modal max-w-full
          h-70
          flex flex-col justify-between items-center
          
          /* 2. Spacing & Shape */
          p-gap-m
          rounded-2xl
          
          /* 3. Style (Background & Shadow) */
          bg-grayscale-white
          shadow-ds-400
        `}
      >
        {/* === 1. Header === */}
        <div className="self-stretch flex justify-between items-center">
          <span className="text-h3-ko text-grayscale-black">
            {title}
          </span>
          
          {/* Close Button */}
          <IconOnlyButton
            ariaLabel="close"
            iconSrc={dismissIcon}
            onClick={onClose}
          />
        </div>

        {/* === 2. Content Area === */}
        {/* w-80 (20rem) -> w-[20rem] or w-80 (Tailwind Default) */}
        <div className="w-m max-w-full flex flex-col gap-gap-s">
          {items.map((item, index) => (
            <div key={index} className="self-stretch flex justify-between items-center">
              <span className="text-h4-ko text-grayscale-black">
                {item.label}
              </span>
              <span className="text-h4-ko text-grayscale-gy400">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* === 3. Footer (Button) === */}
        <div className="w-60">
           {/* 기존 Button 컴포넌트 재사용 (Size M, Solid Variant) */}
          <Button
            label="Btn"
            variant="solid"
            size="M"
            widthClassName="w-full"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}