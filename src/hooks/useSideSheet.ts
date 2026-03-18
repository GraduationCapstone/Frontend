// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LOCAL_STORAGE_KEY } from '../constants/key';
// import { deleteMyAccount, logout, clearAuthStorage } from '../api/auth';
// import { getMyInfo } from '../api/auth';

// export type ModalType = 'none' | 'logout' | 'withdraw' | 'withdrawComplete';

// export default function useSideSheet() {
//   const navigate = useNavigate();
//   const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
//   const [activeModal, setActiveModal] = useState<ModalType>('none');
//   const [userInfo, setUserInfo] = useState<UserMeResponse | null>(null);
//   const [isUserInfoLoading, setIsUserInfoLoading] = useState(false);


//   // [추가] 핵심 로직: URL 경로(pathname)가 바뀔 때마다 사이드 시트 닫기
//   useEffect(() => {
//     setIsSideSheetOpen(false);
//   }, [location.pathname]);

//   useEffect(() => {
//     const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

//     if (!accessToken || !isSideSheetOpen) return;

//     const fetchMyInfo = async () => {
//       try {
//         setIsUserInfoLoading(true);
//         const data = await getMyInfo();
//         console.log('[useSideSheet] getMyInfo success:', data);
//         setUserInfo(data);
//       } catch (error) {
//         console.log('[useSideSheet] getMyInfo failed:', error);
//         setUserInfo(null);
//       } finally {
//         setIsUserInfoLoading(false);
//       }
//     };
//       fetchMyInfo();
//   }, [isSideSheetOpen]);

//   // 사이드 시트 핸들러
//   const handleProfileClick = () => setIsSideSheetOpen((prev) => !prev);
//   const handleCloseSideSheet = () => setIsSideSheetOpen(false);

//   // 모달 핸들러
//   const handleLogoutClick = () => setActiveModal('logout');
//   const handleWithdrawClick = () => setActiveModal('withdraw');
//   const handleCloseModal = () => setActiveModal('none');

//   const handleConfirmLogout = async () => {
//     try {
//       console.log('[useSideSheet] logout 요청 시작');
//       const res = await logout();
//       console.log('[useSideSheet] logout success:', res.data);
//     } catch (error) {
//       console.log('[useSideSheet] logout failed:', error);
//     } finally {
//       clearAuthStorage();
//       console.log('[useSideSheet] localStorage accessToken 삭제 완료');
//       console.log('[useSideSheet] localStorage refreshToken 삭제 완료');
  
//       setActiveModal('none');
//       setIsSideSheetOpen(false);
//       navigate('/login', { replace: true });
//     }
//   };

//   // 탈퇴 확인 (중간 단계)
//   const handleConfirmWithdraw = async () => {
//     const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

//     console.log('[useSideSheet] accessToken 존재 여부:', Boolean(accessToken));

//     try {
//       if (accessToken) {
//         console.log('[useSideSheet] 탈퇴 요청 시작');
//         const res = await deleteMyAccount();
//         console.log('[useSideSheet] 탈퇴 success status:', res.status);

//         if (res.status === 204) {
//           clearAuthStorage();
//           setActiveModal('withdrawComplete');
//         }
//       } else {
//         console.log('[useSideSheet] accessToken 없어서 탈퇴 요청 불가');
//       }
//     } catch (error) {
//       console.log('[useSideSheet] 탈퇴 failed:', error);
//       alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
//     }
//   };

//   // 탈퇴 완료
//   const handleConfirmWithdrawComplete = () => {
//     clearAuthStorage();
//     setActiveModal('none');
//     setIsSideSheetOpen(false);
//     navigate('/login', { replace: true });
//   };

//   return {
//     isSideSheetOpen,
//     activeModal,
//     userInfo,
//     isUserInfoLoading,
//     handleProfileClick,
//     handleCloseSideSheet,
//     handleLogoutClick,
//     handleWithdrawClick,
//     handleCloseModal,
//     handleConfirmLogout,
//     handleConfirmWithdraw,
//     handleConfirmWithdrawComplete,
//   };
// }
