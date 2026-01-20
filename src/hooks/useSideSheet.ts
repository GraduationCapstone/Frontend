import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export type ModalType = 'none' | 'logout' | 'withdraw' | 'withdrawComplete';

export default function useSideSheet() {
  const navigate = useNavigate();
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  const location = useLocation();

  // [추가] 핵심 로직: URL 경로(pathname)가 바뀔 때마다 사이드 시트 닫기
  useEffect(() => {
    setIsSideSheetOpen(false);
  }, [location.pathname]);

  // 사이드 시트 핸들러
  const handleProfileClick = () => setIsSideSheetOpen((prev) => !prev);
  const handleCloseSideSheet = () => setIsSideSheetOpen(false);

  // 모달 핸들러
  const handleLogoutClick = () => setActiveModal('logout');
  const handleWithdrawClick = () => setActiveModal('withdraw');
  const handleCloseModal = () => setActiveModal('none');

  // 로그아웃 확인
  const handleConfirmLogout = () => {
    alert("로그아웃 되었습니다.");
    setActiveModal('none');
    navigate('/login'); // 페이지 이동
  };

  // 탈퇴 확인 (중간 단계)
  const handleConfirmWithdraw = () => {
    setActiveModal('withdrawComplete');
  };

  // 탈퇴 완료
  const handleConfirmWithdrawComplete = () => {
    alert("탈퇴가 완료되었습니다.");
    setActiveModal('none');
    navigate('/login');
  };

  return {
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
  };
}