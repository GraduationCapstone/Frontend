// src/components/common/SideSheet.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListButton } from '../../components/common/ListButton/ListButton';
import ProfileIcon from "./ProfileIcon";
import LogoutIcon from "../../assets/icons/logout.svg?react";
import LeaveIcon from '../../assets/icons/leave.svg?react';
import { fetchUserMe } from "../../api/user";
import { fetchProjects } from "../../api/project";

interface SideSheetProps {
  isOpen: boolean;
  className?: string;
  onLogoutClick?: () => void;
  onWithdrawClick?: () => void;
  activeModal?: string;
}

const NEW_PROJECT_PATH = "/new-project";

export default function SideSheet({
  isOpen,
  className = "",
  onLogoutClick, 
  onWithdrawClick,
  activeModal = "none",
 }: SideSheetProps) {
  const navigate = useNavigate();

  // 💡 프로젝트 목록
  const [username, setUsername] = useState<string>("Loading...");
  const [email, setEmail] = useState<string>("");
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);

  // 백엔드의 id가 숫자(number)이므로 타입을 number | null 로 변경
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // ✨ [추가] 사이드시트가 열릴 때 내 정보 불러오기
  useEffect(() => {
    if (isOpen) {
      const loadUserData = async () => {
        try {
          const [userData, projectsData] = await Promise.all([
            fetchUserMe(),   // 1. 내 정보 가져오기 (이름, 이메일, 프사)
            fetchProjects()  // 2. 내 프로젝트 목록 가져오기 (배열)
          ]);
          
          // 1. 기본 유저 정보 세팅
          setUsername(userData.username);
          setEmail(userData.email);

          // 2. 프로젝트 목록 추출 및 세팅 (projectMembers 배열에서 빼오기)
          const mappedProjects = projectsData.map((project) => ({
            id: project.id,
            name: project.projectName,
          }));
          setProjects(mappedProjects);

          // 3. 만약 선택된 프로젝트가 없고, 받아온 프로젝트가 있다면 첫 번째를 자동 선택
          if (mappedProjects.length > 0 && selectedProjectId === null) {
            setSelectedProjectId(mappedProjects[0].id);
          }
        } catch (error) {
          console.error("유저 정보를 불러오는 데 실패했습니다:", error);
        }
      };

      loadUserData();
    }
  }, [isOpen]); // isOpen이 변할 때마다(열릴 때마다) 실행됨

  if (!isOpen) return null;

  // 💡 정렬 로직: 선택된 프로젝트는 맨 위로, 나머지는 이름순(알파벳순) 정렬
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.id === selectedProjectId) return -1; // a가 선택된 프로젝트면 맨 위로
    if (b.id === selectedProjectId) return 1;  // b가 선택된 프로젝트면 맨 위로
    return a.name.localeCompare(b.name);       // 나머지는 알파벳 순서대로 정렬
  });

  // ✨ [추가] 프로필 아이콘에 들어갈 첫 글자 추출 (없으면 'U')
  const profileInitial = username ? username.charAt(0).toUpperCase() : 'U';

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
          <ProfileIcon isActive={true} initial={profileInitial} />
          <span className="text-grayscale-black text-h4-ko">{username}</span>
        </div>
        {/* Email */}
        <span className="self-stretch text-grayscale-black text-h5-ko">
          {email.includes('@no-email.com') ? '이메일 비공개' : email}
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
              trailing={{ type: "icon", icon: "switch" }} 
              trailingClassName={isSelected ? "opacity-0 pointer-events-none" : ""}
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