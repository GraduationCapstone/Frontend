// src/components/common/SideSheet.tsx
import ProfileIcon from "./ProfileIcon";
import PlusIcon from "../../assets/icons/plus.svg?react";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import DeleteIcon from "../../assets/icons/leave.svg?react"; 

interface SideSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}

export default function SideSheet({ isOpen, className = "" }: SideSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className={[
        // 1. Layout & Size
        "w-overlay-side-sheet", // 332px (20.75rem)
        "flex flex-col items-start gap-1", // gap: 4px
        "py-4", // padding: 16px 0

        // 2. Style
        "bg-grayscale-white",
        "rounded-2xl", // rounded-2xl (16px)
        "shadow-ds-300", // shadow-[0px_4px_20px_0px_rgba(31,35,40,0.20)]
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* --- Section 1: User Info --- */}
      <div className="self-stretch px-5 py-3 flex flex-col justify-center items-start gap-5">
        {/* Profile & Name */}
        <div className="inline-flex justify-start items-center gap-3">
          <ProfileIcon isActive={true} initial="U" />
          <span className="text-grayscale-black text-h4-eng">User1234</span>
        </div>
        {/* Email */}
        <span className="self-stretch text-grayscale-black text-h5-eng">
          User1234@gmail.com
        </span>
      </div>

      {/* --- Divider --- */}
      <div className="self-stretch px-2 py-1 flex flex-col justify-start items-start">
        <div className="self-stretch h-px bg-grayscale-gy300" />
      </div>

      {/* --- Section 2: Projects --- */}
      <div className="self-stretch flex flex-col justify-start items-start">
        {/* Project A (Selected) */}
        <button className="self-stretch px-5 py-3 bg-grayscale-white inline-flex justify-start items-center gap-3 hover:bg-grayscale-gy100 transition-colors">
          <span className="flex-1 text-left text-primary-sg600 text-h5-eng line-clamp-1">
            Project A
          </span>
        </button>

        {/* Project B */}
        <button className="self-stretch px-5 py-3 bg-grayscale-white inline-flex justify-start items-center gap-3 hover:bg-grayscale-gy100 transition-colors">
          <span className="flex-1 text-left text-grayscale-black text-h5-eng line-clamp-1">
            Project B
          </span>
        </button>

        {/* Project C */}
        <button className="self-stretch px-5 py-3 bg-grayscale-white inline-flex justify-start items-center gap-3 hover:bg-grayscale-gy100 transition-colors">
          <span className="flex-1 text-left text-grayscale-black text-h5-eng line-clamp-1">
            Project C
          </span>
        </button>

        {/* New Project */}
        <button className="self-stretch px-5 py-3 bg-grayscale-white inline-flex justify-start items-center gap-2 hover:bg-grayscale-gy100 transition-colors">
          <div className="w-6 h-6 flex items-center justify-center">
            <PlusIcon className="w-6 h-6 text-grayscale-black fill-current" />
          </div>
          <span className="flex-1 text-left text-grayscale-black text-h5-eng line-clamp-1">
            새 프로젝트
          </span>
        </button>
      </div>

      {/* --- Divider --- */}
      <div className="self-stretch px-2 py-1 flex flex-col justify-start items-start">
        <div className="self-stretch h-px bg-grayscale-gy300" />
      </div>

      {/* --- Section 3: Account Actions --- */}
      <div className="self-stretch flex flex-col justify-start items-start">
        {/* Logout */}
        <button className="self-stretch px-5 py-3 bg-grayscale-white inline-flex justify-start items-center gap-2 hover:bg-grayscale-gy100 transition-colors">
          <div className="w-6 h-6 flex items-center justify-center">
             {/* logout.svg 사용 가정 */}
            <LogoutIcon className="w-4 h-4 text-grayscale-black fill-current" />
          </div>
          <span className="flex-1 text-left text-grayscale-black text-h5-eng line-clamp-1">
            로그아웃
          </span>
        </button>

        {/* Withdraw */}
        <button className="self-stretch px-5 py-3 bg-grayscale-white inline-flex justify-start items-center gap-2 hover:bg-grayscale-gy100 transition-colors">
           <div className="w-6 h-6 flex items-center justify-center">
             {/* dismiss.svg 사용 가정 */}
            <DeleteIcon className="w-5 h-4 text-grayscale-black fill-current" />
          </div>
          <span className="flex-1 text-left text-grayscale-black text-h5-eng line-clamp-1">
            탈퇴
          </span>
        </button>
      </div>
    </div>
  );
}