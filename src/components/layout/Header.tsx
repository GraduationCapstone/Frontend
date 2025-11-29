// src/components/layout/Header.tsx
import LogoTypo from '../../assets/logo/Logo_Typo.svg';
import ProfileIcon from '../common/ProfileIcon';

interface HeaderProps {
  isLoggedIn?: boolean;
}

export default function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <header
      className="
        w-full h-[72px] px-10 fixed top-0 left-0 z-50
        bg-grayscale-white border-b border-grayscale-gy200
        flex items-center justify-start gap-[60px]
      "
    >
      {/* 1. Logo */}
      <button onClick={() => window.location.href = '/'} className="flex-shrink-0">
        <img 
          src={LogoTypo} 
          alt="Team Probe Logo" 
          className="h-6 w-auto object-contain" 
        />
      </button>

      {/* 2. Nav & Profile */}
      {isLoggedIn && (
        <>
          <nav className="flex-1 flex justify-start items-center gap-5">
            {/* Menu 1 */}
            <button className="px-5 py-2 flex justify-center items-center rounded-lg hover:bg-grayscale-gy100 transition-colors">
              <span className="
                text-grayscale-black 
                text-base 
                font-semibold 
                font-['Pretendard'] 
                leading-6
                
                /* 👇 자간 추가: 피그마 너비(149px)를 맞추기 위한 핵심 */
                tracking-[-0.02em]
              ">
                Project Management
              </span>
            </button>

            {/* Menu 2 */}
            <button className="px-5 py-2 flex justify-center items-center rounded-lg hover:bg-grayscale-gy100 transition-colors">
              <span className="
                text-grayscale-black 
                text-base 
                font-semibold 
                font-['Pretendard'] 
                leading-6
                
                /* 👇 자간 추가: 피그마 너비(126px)를 맞추기 위한 핵심 */
                tracking-[-0.02em]
              ">
                Service Introduce
              </span>
            </button>
          </nav>

          <div className="flex-shrink-0">
            <ProfileIcon isActive={true} initial="U" />
          </div>
        </>
      )}
    </header>
  );
}