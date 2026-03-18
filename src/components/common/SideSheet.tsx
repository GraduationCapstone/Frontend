// src/components/common/SideSheet.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListButton } from '../../components/common/ListButton/ListButton';
import ProfileIcon from "./ProfileIcon";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import LeaveIcon from '../../assets/icons/leave.svg?react';

interface SideSheetProps {
  isOpen: boolean;
  className?: string;
  onLogoutClick?: () => void;
  onWithdrawClick?: () => void;
  activeModal?: string;
  userInfo?: UserMeResponse | null;
  isUserInfoLoading?: boolean;
}

const NEW_PROJECT_PATH = "/new-project";

export default function SideSheet({
  isOpen,
  className = "",
  onLogoutClick,
  onWithdrawClick,
  activeModal = "none",
  userInfo,
  isUserInfoLoading = false,
}: SideSheetProps) {
  const navigate = useNavigate();

  // 💡 프로젝트 목록
  const [projects] = useState([
    { id: "A", name: "Project A" },
    { id: "B", name: "Project B" },
    { id: "C", name: "Project C" },
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState("A");

  if (!isOpen) return null;

  // 💡 정렬 로직: 선택된 프로젝트는 맨 위로, 나머지는 이름순(알파벳순) 정렬
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.id === selectedProjectId) return -1; // a가 선택된 프로젝트면 맨 위로
    if (b.id === selectedProjectId) return 1;  // b가 선택된 프로젝트면 맨 위로
    return a.name.localeCompare(b.name);       // 나머지는 알파벳 순서대로 정렬
  });


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
          <ProfileIcon
            isActive={true}
            initial={(userInfo?.username ?? userInfo?.githubId ?? "U")
              .charAt(0)
              .toUpperCase()}
          />
          <span className="text-grayscale-black text-h4-ko">
            {isUserInfoLoading ? "불러오는 중..." : userInfo?.username ?? "게스트"}
          </span>
        </div>
        {/* Email */}
        <span className="self-stretch text-grayscale-black text-h5-ko">
          {userInfo?.email ?? "이메일 없음"}
        </span>
      </div>

      {/* --- Divider --- */}
      <div className="self-stretch px-2 py-1 flex flex-col justify-start items-start">
        <div className="self-stretch h-px bg-grayscale-gy300" />
      </div>

      {/* --- Section 2: Projects --- */}
      <div className="self-stretch flex flex-col justify-start items-start">
        
        {/* 정렬된 배열을 순회하며 렌더링 */}
        {sortedProjects.map((project) => {
          const isSelected = project.id === selectedProjectId;
          
          return (
            <ListButton
              key={project.id}
              variant="dynamicWhiteMIconText"
              selected={isSelected}
              label={project.name}
              leading={{ type: "none" }}
              // ✨ hidden 클래스로 아이콘 빈 공간을 없애 글자를 맨 앞으로 당겨옵니다
              leadingClassName="!hidden" 
              // ✨ 선택된 상태면 아이콘 숨김, 아니면 switch 아이콘 표시
              trailing={isSelected ? { type: "none" } : { type: "icon", icon: "switch" }} 
              onClick={() => setSelectedProjectId(project.id)}
              className="w-full"
            />
          );
        })}

        {/* New Project */}
        <ListButton
          variant="dynamicWhiteMIconText"
          selected={false}
          label="새 프로젝트"
          leading={{ type: "icon", icon: "plus" }} // 문자열로 아이콘 지정
          trailing={{ type: "none" }}
          onClick={() => navigate(NEW_PROJECT_PATH)}
          className="w-full"
        />
      </div>

      {/* --- Divider --- */}
      <div className="self-stretch px-2 py-1 flex flex-col justify-start items-start">
        <div className="self-stretch h-px bg-grayscale-gy300" />
      </div>

      {/* --- Section 3: Account Actions --- */}
      <div className="self-stretch flex flex-col justify-start items-start">
        {/* Logout */}
        <ListButton
          variant="dynamicWhiteMIconText"
          selected={activeModal === "logout"}
          label="로그아웃"
          leading={{ type: "icon", icon: "plus" }} // 임시로 plus로 지정하고
          icons={{ plus: LogoutIcon }} // icons 속성으로 LogoutIcon으로 덮어치기!
          trailing={{ type: "none" }}
          onClick={onLogoutClick}
          className="w-full"
        />

        {/* Withdraw */}
        <ListButton
          variant="dynamicWhiteMIconText"
          selected={activeModal === "withdraw"}
          label="탈퇴"
          leading={{ type: "icon", icon: "plus" }} // 임시로 plus로 지정하고
          icons={{ plus: LeaveIcon }} // icons 속성으로 LeaveIcon으로 덮어치기!
          trailing={{ type: "none" }}
          onClick={onWithdrawClick}
          className="w-full"
        />
      </div>
    </div>
  );
}