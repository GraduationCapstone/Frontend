// src/components/layout/Header.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import LogoTypo from '../../assets/logo/Logo_Typo.svg';
import ProfileIcon from '../common/ProfileIcon';
import PersonIcon from '../../assets/icons/person.svg?react';
import Tab from "../common/Tab";

interface HeaderProps {
  isLoggedIn?: boolean;
  /**
   * 헤더 스타일 타입
   * - default: 흰색 배경 (로그인 후 기본)
   * - transparent: 투명 배경 (로그인 전 기본)
   */
  variant?: 'default' | 'transparent';
  onProfileClick?: () => void;
}

export default function Header({ isLoggedIn = false, variant = 'default', onProfileClick }: HeaderProps) {
  const navigate = useNavigate(); // navigate 함수 생성
  const location = useLocation();

  // 로고 클릭 핸들러: 로그인 여부에 따라 경로 분기
  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/home'); // 로그인 된 상태라면 home으로 이동
    } else {
      navigate('/'); 
    }
  };
  
  const handleProjectManagementClick = () => {
    navigate('/project-management');
  }
  
  // 1. 배경색 설정 (테두리 없음)
  const bgClass = variant === 'default' 
    ? 'bg-grayscale-white'  // 흰색 배경
    : 'bg-transparent';     // 투명 배경

  // 2. 레이아웃 설정 (로그인 여부에 따라 정렬 방식 변경)
  // 로그인 전: 양쪽 끝 정렬 (justify-between)
  // 로그인 후: 좌측 정렬 + 간격 (justify-start gap-14)
  const layoutClass = isLoggedIn
    ? 'justify-start gap-14'
    : 'justify-between';

    const isProjectManagementActive = location.pathname.startsWith("/project-management");

    // const isServiceIntroActive = location.pathname.startsWith("/service-intro"); 나중에 서비스 소개 페이지 생기면 추가하기

  return (
    <header
      className={`
        w-full h-16 px-10 fixed top-0 left-0 z-50
        flex items-center
        ${bgClass}
        ${layoutClass}
      `}
    >
      {/* 1. Logo */}
      <button onClick={handleLogoClick} className="flex-shrink-0">
        <img 
          src={LogoTypo} 
          alt="Team Probe Logo" 
          className="h-6 w-auto object-contain" 
        />
      </button>

      {/* 2. Nav & Profile */}
      {isLoggedIn ? (
        <>
          <nav className="flex-1 flex justify-start items-center gap-gap-m">
            {/* Menu 1 */}
            <Tab 
              label="프로젝트 관리" 
              isSelected={isProjectManagementActive} 
              onClick={handleProjectManagementClick} 
            />

            {/* Menu 2 */}
            <Tab 
              label="서비스 소개" 
              isSelected={false} 
              onClick={() => navigate('/service-intro')} // 서비스 소개 페이지로 이동
            />
          </nav>

          <button 
            className="flex-shrink-0 outline-none" 
            onClick={onProfileClick}
          >
            <ProfileIcon isActive={true} initial="U" />
          </button>
        </>
        ) : (
        <button 
          onClick={() => window.location.href = '/login'}
          /* hover:bg-white -> hover:bg-grayscale-white (시스템 컬러 사용) */
          className="pl-3 pr-4 py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-grayscale-white/10 transition-colors"
        >
          <div className="w-6 h-6 flex items-center justify-center">
             <PersonIcon className="w-4 h-4 text-grayscale-white fill-current[&_*]:fill-current [&_*]:stroke-current" />
          </div>
          {/* text-sm ... -> text-h5-ko (타이포그래피 토큰 적용) */}
          <span className="text-center text-grayscale-white text-h5-ko">
            로그인
          </span>
        </button>
      )}
    </header>
  );
}