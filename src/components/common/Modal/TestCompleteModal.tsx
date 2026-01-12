import { ReactNode } from "react";
import dismissIcon from "../../../assets/icons/dismiss.svg";
import { Button } from "../Button"; // 기존 Button 컴포넌트 재사용

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      {/* Modal Container */}
      <div
        className={`
          /* 1. Layout & Size (반응형 X, 고정 크기) */
          w-overlay-modal
          h-[17.5rem]
          flex flex-col justify-between items-center
          
          /* 2. Spacing & Shape */
          p-gap-m
          rounded-2xl
          
          /* 3. Style (Background & Shadow) */
          bg-grayscale-white
          shadow-ds-300
        `}
      >
        {/* === 1. Header === */}
        <div className="self-stretch flex justify-between items-center">
          <span className="text-h3-eng text-grayscale-black">
            {title}
          </span>
          
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-grayscale-gy100 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <img 
                src={dismissIcon} 
                alt="close" 
                className="w-6 h-6" 
              />
            </div>
          </button>
        </div>

        {/* === 2. Content Area === */}
        {/* w-80 (20rem) -> w-[20rem] or w-80 (Tailwind Default) */}
        <div className="w-80 flex flex-col gap-gap-s">
          {items.map((item, index) => (
            <div key={index} className="self-stretch flex justify-between items-center">
              <span className="text-h4-eng text-grayscale-black">
                {item.label}
              </span>
              <span className="text-h4-eng text-grayscale-gy400">
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
            widthClassName="w-full" // w-60을 채우기 위해
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}