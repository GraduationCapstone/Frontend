// src/pages/Home/TA/UserRqInputView.tsx
import type { ScenarioCategory } from "./UserRqInputModel";
import FloatingBtn from "../../components/common/FloatingBtn";
import SelectTrigger from "../../components/common/TriggerButton/SelectTrigger";
import TestDownloadModal from "../../components/common/Modal/TestDownloadModal";
import TestCompleteModal from "../../components/common/Modal/TestCompleteModal";
import type { TestProcessStage } from "./UserRqInputModel";

import InputField from "../../components/common/InputField";
import { Button } from "../../components/common/Button";

import PencilIcon from "../../assets/icons/pencil.svg?react";
import PersonIcon from "../../assets/icons/person.svg?react";
import KeyIcon from "../../assets/icons/key.svg?react";
import CommentIcon from "../../assets/icons/comment.svg?react";
import InternetIcon from "../../assets/icons/internet.svg?react";
import GlobeIcon from "../../assets/icons/globe.svg?react";
import EtcIcon from "../../assets/icons/etc.svg?react";

interface Props {
  testName: string;
  setTestName: (val: string) => void;
  isEditingTestName: boolean;
  setIsEditingTestName: (val: boolean) => void;
  testNameError: string;
  handleSaveTestName: () => void;
  scenarios: ScenarioCategory[];
  selectedIds: Set<string>;
  toggleScenario: (id: string) => void;
  canProceed: boolean;
  handleNext: () => void;

  isModalOpen: boolean;
  handleCloseModal: () => void;
  planStatus: "generating" | "complete";
  elapsedTime: number;
  handleDownload: () => void;
  handleStartTest: () => void;
  
  isTestProcessModalOpen: boolean;
  handleCloseTestModal: () => void;
  testProcessStage: TestProcessStage;
  codeGenTime: number;
  testRunTime: number;
  isTestPaused: boolean;
  handleTogglePause: () => void;
  handleGoToDashboard: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  member: <PersonIcon className="w-6 h-6" />,
  auth: <KeyIcon className="w-6 h-6" />,
  content: <CommentIcon className="w-6 h-6" />,
  ui: <GlobeIcon className="w-6 h-6" />,
  network: <InternetIcon className="w-6 h-6" />,
  etc: <EtcIcon className="w-6 h-6" />,
};

export default function UserRqInputView({
  testName,
  setTestName,
  isEditingTestName,
  setIsEditingTestName,
  testNameError,
  handleSaveTestName,
  scenarios,
  selectedIds,
  toggleScenario,
  canProceed,
  handleNext,
  isModalOpen,
  handleCloseModal,
  planStatus,
  elapsedTime,
  handleDownload,
  handleStartTest,
  
  isTestProcessModalOpen,
  handleCloseTestModal,
  testProcessStage,
  codeGenTime,
  testRunTime,
  isTestPaused,
  handleTogglePause,
  handleGoToDashboard,
}: Props) {

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const isGenerating = planStatus === "generating";

  return (
    <div className="w-full h-[calc(100vh-5rem)] mt-20 flex bg-grayscale-white relative">
      {/* 1. Sidebar */}
      <aside className="w-overlay-side-sheet self-stretch px-gap-xl py-16 bg-grayscale-white flex flex-col gap-14 border-r border-grayscale-gy200/50">
        {isEditingTestName ? (
          // [편집 모드] InputField + 저장 버튼 (TFSelect와 동일 로직)
          <div className="self-stretch flex flex-col justify-start items-center gap-3">
            <InputField
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              showIcon={false}
              placeholder="Test Name"
              widthClass="w-full"
              isError={testNameError.length > 0}
              errorMessage={testNameError}
            />
            <Button 
              variant="dynamicSg500SText" 
              onClick={handleSaveTestName}
              disabled={testName.trim() === ''}
            >
              저장
            </Button>
          </div>
        ) : (
          // [기본 모드] 테스트명 표시 + 연필 아이콘
          <div className="self-stretch pl-2 py-2 flex justify-between items-center">
            <span className="text-h3-ko text-grayscale-black truncate">{testName}</span>
            <button 
              className="p-1 rounded-lg hover:bg-grayscale-gy100"
              onClick={() => setIsEditingTestName(true)}
            >
              <PencilIcon className="w-6 h-6 [&_*]:fill-grayscale-black" />
            </button>
          </div>
        )}
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 px-28 py-24 bg-grayscale-gy50 flex flex-col items-center gap-14 overflow-y-auto">
        <h2 className="w-full text-left text-h2-ko text-grayscale-black">
          테스트 시나리오 가이드
        </h2>

        <div className="w-full max-w-size-max flex flex-col gap-14">
          {scenarios.map((category) => (
            <section key={category.title} className="flex flex-col gap-7">
              {/* Category Title */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center text-grayscale-black">
                  {ICON_MAP[category.iconType]}
                </div>
                <h3 className="text-h3-ko text-grayscale-black">{category.title}</h3>
              </div>

              {/* Scenario Grid */}
              <div className="grid grid-cols-4 gap-8">
                {category.items.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <SelectTrigger
                      key={item.id}
                      label={item.label}
                      variant="dynamic"
                      selected={isSelected} // 추가됨
                      onClick={() => toggleScenario(item.id)}
                      // 색상 조건문 삭제, 기본 형태만 유지
                      className="px-5 py-3 rounded-xl" 
                      iconClassName="hidden"
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* 3. Floating Action Button */}
      <div className="fixed bottom-14 right-14">
        <FloatingBtn onClick={handleNext} disabled={!canProceed}>
          다음
        </FloatingBtn>
      </div>

      {/* 기존 모달 컴포넌트 사용 */}
      <TestDownloadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="테스트 계획서"
        
        // 버튼 라벨 설정
        downloadLabel="테스트 계획서 다운로드"
        confirmLabel="테스트 시작"
        
        // 버튼 동작 연결
        onDownload={handleDownload}
        onConfirm={handleStartTest} // '취소' 버튼 위치에 '시작' 동작 연결
        
        // 상태에 따른 비활성화 처리
        disabled={isGenerating}
        
        // 본문 내용 (상태 텍스트 + 타이머)
        items={[
          { 
            label: isGenerating ? "생성 중.." : "생성 완료!", 
            value: formatTime(elapsedTime) 
          }
        ]}
      />

      <TestCompleteModal
        isOpen={isTestProcessModalOpen}
        onClose={handleCloseTestModal}
        stage={testProcessStage}
        codeGenTime={codeGenTime}
        testRunTime={testRunTime}
        isPaused={isTestPaused}
        onTogglePause={handleTogglePause}
        onGoToDashboard={handleGoToDashboard}
      />
    </div>
  );
}