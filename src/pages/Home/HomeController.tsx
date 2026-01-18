// src/pages/Home/HomeController.tsx
import { useHomeModel } from './HomeModel';
import HomeView from './HomeView';

export default function HomeController() {
  // 1. Model(로직) 호출
  const {
    projectItems,
    selectedProject,
    testName,
    canStart,
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
    handleProjectChange,
    handleTestNameChange,
    handleStartTest,
  } = useHomeModel();

  // 2. View(화면)에 데이터와 함수 전달
  return (
    <HomeView 
      projectItems={projectItems}
      selectedProject={selectedProject}
      testName={testName}
      canStart={canStart}
      isSideSheetOpen={isSideSheetOpen} 
      activeModal={activeModal}     
      onProfileClick={handleProfileClick}    
      onCloseSideSheet={handleCloseSideSheet}
      onLogoutClick={handleLogoutClick} 
      onWithdrawClick={handleWithdrawClick} 
      onCloseModal={handleCloseModal} 
      onConfirmLogout={handleConfirmLogout} 
      onConfirmWithdraw={handleConfirmWithdraw} 
      onConfirmWithdrawComplete={handleConfirmWithdrawComplete}
      onProjectChange={handleProjectChange}
      onTestNameChange={handleTestNameChange}
      onStartTest={handleStartTest}
    />
  );
}