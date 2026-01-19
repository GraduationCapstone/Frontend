import { ReactNode } from "react";
import dismissIcon from "../../../assets/icons/dismiss.svg?react";
import { Button, IconOnlyButton } from "../Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  children: ReactNode; 
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  confirmLabel,
  children,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-grayscale-black/40" 
      />
      
      {/* Modal Container */}
      <div
        className={`
          relative
          w-overlay-modal max-w-full 
          h-70                       
          p-gap-m                    
          flex flex-col justify-between items-center
          bg-grayscale-white
          rounded-2xl
          shadow-ds-400
          overflow-hidden
        `}
      >
        {/* 1. Header (Close Button Only - Right Aligned) */}
        <div className="self-stretch flex justify-end items-center">
          <IconOnlyButton
            variant="staticClearXsIcon"
            ariaLabel="close"
            Icon={dismissIcon}
            onClick={onClose}
          />
        </div>

        {/* 2. Content (Center Aligned) */}
        <div className="flex flex-col justify-start items-center gap-3">
          {children}
        </div>

        {/* 3. Footer (Single Button) */}
        <div className="w-60">
          <Button
            variant="staticGy900MText"
            className="w-full"
            onClick={onConfirm}
            label={confirmLabel}
            children={undefined}
          />
        </div>
      </div>
    </div>
  );
}