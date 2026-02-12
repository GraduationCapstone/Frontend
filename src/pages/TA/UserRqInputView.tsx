// src/pages/Home/TA/UserRqInputView.tsx
import type { ScenarioCategory } from "./UserRqInputModel";
import FloatingBtn from "../../components/common/FloatingBtn";
import TestDownloadModal from "../../components/common/Modal/TestDownloadModal";
import TestCompleteModal from "../../components/common/Modal/TestCompleteModal";
import type { TestProcessStage } from "./UserRqInputModel";

import PencilIcon from "../../assets/icons/pencil.svg?react";
import PersonIcon from "../../assets/icons/person.svg?react";
import KeyIcon from "../../assets/icons/key.svg?react";
import CommentIcon from "../../assets/icons/comment.svg?react";
import InternetIcon from "../../assets/icons/internet.svg?react";
import GlobeIcon from "../../assets/icons/globe.svg?react";
import EtcIcon from "../../assets/icons/etc.svg?react";

interface Props {
  testName: string;
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
  handleGenerateReport: () => void;

  reportGenTime: number;
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
  handleGenerateReport,

  reportGenTime,
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
    <div className="flex w-full min-h-screen bg-grayscale-white">
      {/* 1. Sidebar */}
      <aside className="w-overlay-side-sheet self-stretch px-gap-xl py-16 bg-grayscale-white flex flex-col gap-14 border-r border-grayscale-gy200/50">
        <div className="self-stretch pl-2 py-2 flex justify-between items-center">
          <span className="text-h3-ko text-grayscale-black">{testName}</span>
          <button className="p-1 rounded-lg hover:bg-grayscale-gy100">
            <PencilIcon className="w-6 h-6 [&_*]:fill-grayscale-black" />
          </button>
        </div>
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
                    <button
                      key={item.id}
                      onClick={() => toggleScenario(item.id)}
                      className={`
                        w-full px-5 py-3 rounded-xl shadow-ds-200 transition-all duration-200
                        flex justify-start items-center gap-2
                        ${isSelected 
                          ? "bg-secondary-sg100" 
                          : "bg-grayscale-white hover:bg-grayscale-gy100"}
                      `}
                    >
                      <span className={`
                        flex-1 text-left text-medium500-ko line-clamp-1
                        ${isSelected ? "text-primary-sg600" : "text-grayscale-black"}
                      `}>
                        {item.label}
                      </span>
                    </button>
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
        onGenerateReport={handleGenerateReport}
        reportGenTime={reportGenTime}
        onGoToDashboard={handleGoToDashboard}
      />
    </div>
  );
}