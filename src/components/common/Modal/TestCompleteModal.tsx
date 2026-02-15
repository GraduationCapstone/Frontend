import dismissIcon from "../../../assets/icons/dismiss.svg?react";
import { Button, IconOnlyButton } from "../Button";
import type { TestProcessStage } from "../../../pages/TA/UserRqInputModel";

interface TestCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: TestProcessStage;
  codeGenTime: number;
  testRunTime: number;
  reportGenTime: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onGenerateReport: () => void;
  onGoToDashboard: () => void;
}

export default function TestCompleteModal({
  isOpen,
  onClose,
  stage,
  codeGenTime,
  testRunTime,
  reportGenTime,
  isPaused,
  onTogglePause,
  onGenerateReport,
  onGoToDashboard,
}: TestCompleteModalProps) {
  if (!isOpen) return null;

  // 1. 시간 포맷팅 함수 (분:초)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const title = (stage === "report_generating" || stage === "report_complete")
    ? "테스트 결과 보고서"
    : "테스트";

  // 2. 단계(stage)에 따라 보여줄 텍스트 데이터 생성
  const getItems = () => {
    const items = [];

    // 보고서 생성 단계: 기존 내용은 숨기고 보고서 상태만 표시
    if (stage === "report_generating" || stage === "report_complete") {
      const label = stage === "report_generating" ? "생성 중.." : "생성 완료!";
      items.push({ label: label, value: formatTime(reportGenTime) });
      return items;
    }
    
    // 첫 번째 줄: 코드 생성 상태
    if (stage === "generating") {
      items.push({ label: "테스트 코드 생성 중..", value: formatTime(codeGenTime) });
    } else {
      items.push({ label: "테스트 코드 생성 완료!", value: formatTime(codeGenTime) });
    }

    // 두 번째 줄: 테스트 진행 상태 (생성 완료 후부터 표시)
    if (stage === "testing" || stage === "complete") {
      if (stage === "complete") {
        items.push({ label: "테스트 완료!", value: formatTime(testRunTime) });
      } else {
        items.push({ label: "테스트 중..", value: formatTime(testRunTime) });
      }
    }
    return items;
  };

  // 3. [로직 통합] 버튼 텍스트 및 동작 결정
  let buttonLabel = "";
  let handleButtonClick = () => {};

  if (stage === "report_complete") {
    // 보고서 완료 -> 대시보드 이동
    buttonLabel = "대시보드로 이동";
    handleButtonClick = onGoToDashboard;
  } else if (stage === "complete") {
    // 테스트 완료 -> 보고서 생성
    buttonLabel = "테스트 결과 보고서 생성";
    handleButtonClick = onGenerateReport;
  } else {
    // 그 외(진행 중) -> 일시정지/재개
    buttonLabel = isPaused ? "재개" : "일시정지";
    handleButtonClick = onTogglePause;
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Modal Container */}
      <div
        className={`
          w-overlay-modal max-w-full
          h-70
          flex flex-col justify-between items-center
          
          /* 2. Spacing & Shape */
          p-gap-m
          rounded-2xl
          
          /* 3. Style (Background & Shadow) */
          bg-grayscale-white
          shadow-ds-400
        `}
      >
        {/* === 1. Header === */}
        <div className="self-stretch flex justify-between items-center">
          <span className="text-h3-ko text-grayscale-black">
            {title}
          </span>
          
          {/* Close Button */}
          <IconOnlyButton
            variant="staticClearXsIcon"
            ariaLabel="close"
            Icon={dismissIcon}
            onClick={onClose}
          />
        </div>

        {/* === 2. Content Area === */}
        <div className="w-m max-w-full flex flex-col gap-gap-s">
          {getItems().map((item, index) => (
            <div key={index} className="self-stretch flex justify-between items-center">
              <span className="text-h4-ko text-grayscale-black">
                {item.label}
              </span>
              <span className="text-h4-ko text-grayscale-gy400">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* === 3. Footer (Button) === */}
        <div className="w-60">
           {/* 버튼 텍스트와 클릭 핸들러를 Props로 연결 */}
          <Button
            variant="staticGy900MText"
            className="w-full rounded-xl shadow-ds-200"
            onClick={(e) => {
              e.currentTarget.blur(); 
              handleButtonClick();
            }}
            label={buttonLabel}
            children={buttonLabel}
          />
        </div>
      </div>
    </div>
  );
}