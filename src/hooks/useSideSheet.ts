import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../api/axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { getMyInfo, deleteMyAccount } from '../api/auth';
import type { UserMeResponse } from '../types/user';

export type ModalType = 'none' | 'logout' | 'withdraw' | 'withdrawComplete';

export default function useSideSheet() {
  const navigate = useNavigate();
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  const location = useLocation();

  const [userInfo, setUserInfo] = useState<UserMeResponse | null>(null);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(false);

  // [추가] 핵심 로직: URL 경로(pathname)가 바뀔 때마다 사이드 시트 닫기
  useEffect(() => {
    setIsSideSheetOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (!accessToken || !isSideSheetOpen) return;

    const fetchMyInfo = async () => {
      try {
        setIsUserInfoLoading(true);
        const data = await getMyInfo();
        console.log('[useSideSheet] getMyInfo success:', data);
        setUserInfo(data);
      } catch (error) {
        console.log('[useSideSheet] getMyInfo failed:', error);
        setUserInfo(null);
      } finally {
        setIsUserInfoLoading(false);
      }
    };
      fetchMyInfo();
  }, [isSideSheetOpen]);

  // 사이드 시트 핸들러
  const handleProfileClick = () => setIsSideSheetOpen((prev) => !prev);
  const handleCloseSideSheet = () => setIsSideSheetOpen(false);

  // 모달 핸들러
  const handleLogoutClick = () => setActiveModal('logout');
  const handleWithdrawClick = () => setActiveModal('withdraw');
  const handleCloseModal = () => setActiveModal('none');

  const handleConfirmLogout = async () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  
    console.log('[useSideSheet] accessToken 존재 여부:', Boolean(accessToken));
  
    try {
      if (accessToken) {
        console.log('[useSideSheet] logout 요청 시작');
        const res = await axiosInstance.post('/api/auth/logout');
        console.log('[useSideSheet] logout success:', res.data);
      } else {
        console.log('[useSideSheet] accessToken 없어서 서버 호출 없이 프론트 로그아웃 진행');
      }
    } catch (error) {
      console.log('[useSideSheet] logout failed:', error);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
      console.log('[useSideSheet] localStorage accessToken 삭제 완료');
      console.log('[useSideSheet] localStorage refreshToken 삭제 완료');
  
      setActiveModal('none');
      setIsSideSheetOpen(false);
      navigate('/login', { replace: true });
    }
  };

  // 탈퇴 확인 (중간 단계)
  const handleConfirmWithdraw = async () => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    console.log('[useSideSheet] accessToken 존재 여부:', Boolean(accessToken));

    try {
      if (accessToken) {
        console.log('[useSideSheet] 탈퇴 요청 시작');
        const res = await deleteMyAccount();
        console.log('[useSideSheet] 탈퇴 success:', res.data);
      } else {
        console.log('[useSideSheet] accessToken 없어서 탈퇴 요청 불가');
    }
    setActiveModal('withdrawComplete');
  } catch (error) {
    console.log('[useSideSheet] 탈퇴 failed:', error);
    alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
  }
  };

  // 탈퇴 완료
  const handleConfirmWithdrawComplete = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
    setUserInfo(null);
    setActiveModal('none');
    navigate('/login');
  };

  return {
    isSideSheetOpen,
    activeModal,
    userInfo,
    isUserInfoLoading,
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