// src/pages/Home/HomeModel.tsx
import { useState, ChangeEvent } from 'react';

type ModalType = 'none' | 'logout' | 'withdraw' | 'withdrawComplete';

export const useHomeModel = () => {
  // 1. 상태 관리 (Data)
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [testName, setTestName] = useState<string>('');
  const [isSideSheetOpen, setIsSideSheetOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');

  // 2. Mock Data (실제 API 연동 시 이 부분을 대체)
  const projectItems = [
    { value: 'project-a', label: 'Project A' },
    { value: 'project-b', label: 'Project B' },
    { value: 'project-c', label: 'Project C' },
  ];

  // 3. 비즈니스 로직 (Logic)
  // 프로젝트와 테스트명이 모두 입력되어야 시작 가능
  const canStart = !!selectedProject && testName.length > 0;

  // 4. 이벤트 핸들러 (Actions)
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
  };

  const handleTestNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTestName(e.target.value);
  };

  const handleStartTest = () => {
    if (!canStart) return;
    alert(`테스트 시작!\n프로젝트: ${selectedProject}\n테스트명: ${testName}`);
    // 여기에 페이지 이동이나 API 호출 로직 추가
  };

  // ✅ 프로필 클릭 시 사이드시트 토글
  const handleProfileClick = () => {
    setIsSideSheetOpen((prev) => !prev);
  };
  
  // ✅ 사이드시트 닫기
  const handleCloseSideSheet = () => {
    setIsSideSheetOpen(false);
  };

  // 1. 로그아웃 버튼 클릭 (사이드시트)
  const handleLogoutClick = () => {
    setActiveModal('logout');  // 모달 열기
  };

  // 2. 탈퇴 버튼 클릭 (사이드시트)
  const handleWithdrawClick = () => {
    setActiveModal('withdraw');
  };

  // 3. 모달 닫기 (X 버튼)
  const handleCloseModal = () => setActiveModal('none');

  // 4. 로그아웃 확인
  const handleConfirmLogout = () => {
    alert("로그아웃 되었습니다."); // 실제 로직: API 호출 후 리다이렉트
    setActiveModal('none');
    window.location.href = '/login'; // 예시 리다이렉트
  };

  // 5. 탈퇴 확인 -> 완료 모달로 변경
  const handleConfirmWithdraw = () => {
    setActiveModal('withdrawComplete');
  };

  // 6. 탈퇴 완료 확인
  const handleConfirmWithdrawComplete = () => {
    alert("탈퇴가 완료되었습니다.");
    setActiveModal('none');
    window.location.href = '/login';
  };

  // Controller에서 사용할 값과 함수들을 반환
  return {
    projectItems,
    selectedProject,
    testName,
    canStart,
    isSideSheetOpen,
    activeModal,       
    handleProfileClick,    
    handleCloseSideSheet,  
    handleProjectChange,
    handleTestNameChange,
    handleStartTest,
    handleLogoutClick,
    handleWithdrawClick,
    handleCloseModal,
    handleConfirmLogout,
    handleConfirmWithdraw,
    handleConfirmWithdrawComplete,
  };
};