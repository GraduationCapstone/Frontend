// src/pages/Home/HomeView.tsx
import { ChangeEvent } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Dropbox from '../../components/common/Dropbox';
import InputField from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import SideSheet from '../../components/common/SideSheet';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
import bgVideo from '../../assets/bg/BG.mp4';

type ModalType = 'none' | 'logout' | 'withdraw' | 'withdrawComplete';

// Controller로부터 받을 Props 타입 정의
interface HomeViewProps {
  projectItems: { value: string; label: string }[];
  selectedProject: string;
  testName: string;
  canStart: boolean;
  isSideSheetOpen: boolean;
  activeModal: ModalType;
  onProfileClick: () => void; 
  onCloseSideSheet: () => void; 
  onLogoutClick: () => void;
  onWithdrawClick: () => void;
  onCloseModal: () => void;
  onConfirmLogout: () => void;
  onConfirmWithdraw: () => void;
  onConfirmWithdrawComplete: () => void;
  onProjectChange: (value: string) => void;
  onTestNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onStartTest: () => void;
}

export default function HomeView({
  projectItems,
  selectedProject,
  testName,
  canStart,
  isSideSheetOpen,
  activeModal,      
  onProfileClick,    
  onCloseSideSheet,
  onLogoutClick,  
  onWithdrawClick, 
  onCloseModal, 
  onConfirmLogout, 
  onConfirmWithdraw, 
  onConfirmWithdrawComplete,
  onProjectChange,
  onTestNameChange,
  onStartTest,
}: HomeViewProps) {
  return (
    // 1. 기존 bg-grayscale-white 제거, relative 및 overflow-hidden 추가
    <div className="relative flex flex-col min-h-screen items-center w-full overflow-hidden">
      
      {/* --- 배경 비디오 (Background Video) --- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-20"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* --- 그라데이션 오버레이 (Gradient Overlay) --- */}
      {/* 피그마: bg-gradient-to-b from-Colors-Gray-Scale-White to-white/0 */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-grayscale-white to-transparent -z-10" />


      {/* --- 메인 콘텐츠 (z-index가 비디오보다 높아야 함) --- */}
      {/* 1. Header */}
      <Header 
      isLoggedIn={true}
      variant="default"
      onProfileClick={onProfileClick}
      />

      {isSideSheetOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-transparent cursor-default"
          onClick={onCloseSideSheet}
        />
      )}

      <SideSheet 
        isOpen={isSideSheetOpen} 
        onLogoutClick={onLogoutClick}
        onWithdrawClick={onWithdrawClick}
        activeModal={activeModal}
        className="absolute top-[5rem] right-[2.5rem] z-[60]"
      />

      {/* ✅ 1. 로그아웃 모달 */}
      <ConfirmModal
        isOpen={activeModal === 'logout'}
        onClose={onCloseModal}
        onConfirm={onConfirmLogout}
        confirmLabel="로그아웃"
      >
        <div className="text-h4-ko text-grayscale-black text-center">
          로그아웃하시겠습니까?
        </div>
      </ConfirmModal>

      {/* ✅ 2. 탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={activeModal === 'withdraw'}
        onClose={onCloseModal}
        onConfirm={onConfirmWithdraw}
        confirmLabel="탈퇴"
      >
        <div className="text-h4-ko text-grayscale-black text-center">
          탈퇴하시겠습니까?
        </div>
        <div className="text-h4-ko text-grayscale-black text-center">
          계정 정보가 영구적으로 삭제됩니다.
        </div>
      </ConfirmModal>

      {/* ✅ 3. 탈퇴 완료 모달 */}
      <ConfirmModal
        isOpen={activeModal === 'withdrawComplete'}
        onClose={onCloseModal}
        onConfirm={onConfirmWithdrawComplete}
        confirmLabel="확인"
      >
        <div className="text-h4-ko text-grayscale-black text-center">
          탈퇴 처리가 완료되었습니다.
        </div>
        <div className="text-h4-ko text-grayscale-black text-center">
          더 발전하는 Probe가 되겠습니다.
        </div>
      </ConfirmModal>

      {/* 2. Main Content */}
      <main className="flex-1 w-full max-w-[120rem] px-[2rem] pt-[18rem] pb-[6rem] flex flex-col items-center gap-[11rem] z-0">
        
        {/* Title Area */}
        <section className="flex flex-col items-center gap-[2rem]">
          <h1 className="text-extra-ko text-grayscale-black text-center">
            Probe로 테스트를 자동화하세요.
          </h1>
          <h2 className="text-h1-ko text-grayscale-black text-center">
            당신의 코드를 이해하는 AI, 테스트 워크플로를 하나로
          </h2>
        </section>

        {/* Input Form Area */}
        <section className="w-l flex flex-col gap-[2rem]">
          
          {/* Project Select */}
          <div className="flex flex-col gap-[0.5rem]">
            <Dropbox 
              items={projectItems}
              value={selectedProject}
              onValueChange={onProjectChange}
              placeholder="Project A"
              className="w-full"
            />
          </div>

          {/* Test Name Input */}
          <InputField 
            placeholder="테스트명 입력"
            value={testName}
            onChange={onTestNameChange}
            showIcon={false} 
            widthClass="w-full"
          />

          {/* Start Button */}
          <Button 
            variant="staticGy900LText"
            label="테스트 시작"
            children={undefined}
            disabled={!canStart}
            onClick={onStartTest}
            className="w-full"
          />
        </section>

      </main>

      {/* 3. Footer */}
      <Footer variant="default" />
    </div>
  );
}