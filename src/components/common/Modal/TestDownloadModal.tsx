import { useEffect, useState } from "react";
import dismissIcon from "../../../assets/icons/dismiss.svg?react";
import downloadIcon from "../../../assets/icons/download.svg?react";
import { Button, IconOnlyButton } from "../Button";

interface TestDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  onConfirm?: () => void;
  title?: string;
  downloadLabel?: string;
  confirmLabel?: string;
  /** 본문 데이터 (왼쪽 라벨, 오른쪽 값) */
  items?: { label: string; value: string }[];
  disabled?: boolean;
}

export default function TestDownloadModal({
  isOpen,
  onClose,
  onDownload,
  onConfirm,
  title = "Header",
  downloadLabel = "Download",
  confirmLabel = "Confirm",
  items = [
    { label: "Text", value: "00s" },
    { label: "Text", value: "00s" },
  ],
  disabled = false,
}: TestDownloadModalProps) {
  if (!isOpen) return null;

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Modal Container */}
      <div
        className={`
          /* 1. Layout & Size */
          w-overlay-modal max-w-full  /* 35.25rem (564px) */
          h-70      /* 280px (CSS 요청사항 반영) */
          flex flex-col justify-between items-center
          
          /* 2. Spacing & Shape */
          p-gap-m           /* 1.25rem (20px) */
          rounded-2xl
          
          /* 3. Style */
          bg-grayscale-white
          shadow-ds-400
        `}
      >
        {/* === Header === */}
        <div className="self-stretch flex justify-between items-center">
          <span className="text-h3-ko text-grayscale-black">
            {title}
          </span>
          
          {/* Close Button */}
        <IconOnlyButton
            ariaLabel="close"
            Icon={dismissIcon}
            onClick={onClose}
            variant="staticClearXsIcon"
          />
        </div>

        {/* === Content === */}
        {/* w-80 (20rem) fixed width content area */}
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

        {/* === Footer (Two Buttons) === */}
        {/* Gap: 16px (gap-4) -> gap-gap-s (1rem) 매핑 */}
        <div className="self-stretch flex gap-gap-s">
          {/* 1. Download Button (With Icon) */}
          <div className="flex-1">
            <Button
              Icon={downloadIcon}
              variant="dynamicGy900MIconText"
              className="w-full rounded-xl shadow-ds-200"
              onClick={onDownload}
              disabled={disabled}
              // 왼쪽 아이콘 추가 (흰색 필터를 위해 MaskIcon 방식 대신 이미지 사용)
              // Button 컴포넌트가 solid일 때 텍스트가 흰색이므로 아이콘도 흰색이나 밝은색 권장
              iconPosition="left"
              iconClassName="w-6 h-6 brightness-0 invert"
              label={downloadLabel}
              />
          </div>

          {/* 2. Cancel Button (Text Only) */}
          <div className="flex-1">
             <Button
              variant="dynamicGy900MIconText"
              className="w-full rounded-xl shadow-ds-200"
              onClick={onConfirm || onClose} /* 별도 동작 없으면 닫기 */
              disabled={disabled}
              label={confirmLabel}
              // 구조 유지를 위해 아이콘을 넘기되, 클래스로 숨김 처리
              Icon={downloadIcon} 
              iconClassName="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}