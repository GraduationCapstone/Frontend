// src/components/layout/MainLayout.tsx
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SideSheet from '../common/SideSheet';
import ConfirmModal from '../common/Modal/ConfirmModal';
import useSideSheet from '../../hooks/useSideSheet';

export default function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';
  // 레이아웃 레벨에서 사이드 시트 상태 관리
  const {
    isSideSheetOpen,
    activeModal,
    handleProfileClick,
    handleCloseSideSheet,
    handleLogoutClick,
    handleWithdrawClick,
    handleCloseModal,
    handleConfirmLogout,
    handleConfirmWithdraw,
    handleConfirmWithdrawComplete,
  } = useSideSheet();

  return (
    <div 
      className={`relative flex flex-col min-h-screen items-center w-full overflow-hidden ${
        // 홈('/')이면 투명(비디오 보임), 아니면 흰색 배경
        isHome ? 'bg-transparent' : 'bg-grayscale-white'
      }`}
    >
      {/* 1. Header (공통) */}
      <Header 
        isLoggedIn={true} 
        variant="default" 
        onProfileClick={handleProfileClick} 
      />

      {/* 2. SideSheet & Modals (공통) */}
      {isSideSheetOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-transparent cursor-default"
          onClick={handleCloseSideSheet}
        />
      )}

      <SideSheet 
        isOpen={isSideSheetOpen} 
        onLogoutClick={handleLogoutClick}
        onWithdrawClick={handleWithdrawClick}
        activeModal={activeModal}
        className="fixed top-[5rem] right-[2.5rem] z-[60]"
      />

      <ConfirmModal
        isOpen={activeModal === 'logout'}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        confirmLabel="로그아웃"
      >
        <div className="text-h4-ko text-grayscale-black text-center">
          로그아웃하시겠습니까?
        </div>
      </ConfirmModal>

      <ConfirmModal
        isOpen={activeModal === 'withdraw'}
        onClose={handleCloseModal}
        onConfirm={handleConfirmWithdraw}
        confirmLabel="탈퇴"
      >
        <div className="text-h4-ko text-grayscale-black text-center">
          탈퇴하시겠습니까?
        </div>
        <div className="text-h4-ko text-grayscale-black text-center">
          계정 정보가 영구적으로 삭제됩니다.
        </div>
      </ConfirmModal>

      <ConfirmModal
        isOpen={activeModal === 'withdrawComplete'}
        onClose={handleCloseModal}
        onConfirm={handleConfirmWithdrawComplete}
        confirmLabel="확인"
      >
        <div className="text-h4-ko text-grayscale-black text-center">
          탈퇴 처리가 완료되었습니다.
        </div>
        <div className="text-h4-ko text-grayscale-black text-center">
          더 발전하는 Probe가 되겠습니다.
        </div>
      </ConfirmModal>

      {/* 3. Page Content (각 페이지 내용이 들어갈 자리) */}
      {/* Outlet이 각 Route의 element로 대체됩니다 */}
      <Outlet />

      {/* 4. Footer (공통) */}
      <div className={`w-full ${isHome ? 'bg-transparent' : ''}`}>
        <Footer variant="default" />
      </div>
    </div>
  );
}