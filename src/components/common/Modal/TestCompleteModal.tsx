import dismissIcon from "../../../assets/icons/dismiss.svg?react";
import { Button, IconOnlyButton } from "../Button";
import type { TestProcessStage } from "../../../pages/TA/UserRqInputModel";

interface TestCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: TestProcessStage;
  codeGenTime: number;
  testRunTime: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onGoToDashboard: () => void;
}

export default function TestCompleteModal({
  isOpen,
  onClose,
  stage,
  testRunTime,
  isPaused,
  onTogglePause,
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

  const title = stage === "complete" ? "테스트 완료!" : "테스트 진행 중";

  // 2. 단계(stage)에 따라 보여줄 텍스트 데이터 생성
  const getItems = () => {
    const items = [];
    
    // ✨ 통합된 테스트 진행 단계 (generating 조건문 삭제)
    if (stage === "testing" || stage === "complete") {
      const label = stage === "complete" 
        ? "테스트 코드 생성 및 테스트 완료!" 
        : "테스트 코드 생성 및 테스트 중..";
        
      items.push({ label: label, value: formatTime(testRunTime) });
    }
    return items;
  };

  // 3. [로직 통합] 버튼 텍스트 및 동작 결정
  let buttonLabel = "";
  let handleButtonClick = () => {};

  if (stage === "complete") {
    // 테스트가 완료되면 바로 대시보드로 이동하도록 수정
    buttonLabel = "테스트 대시보드로 이동"; 
    handleButtonClick = onGoToDashboard;
  } else {
    // 테스트 진행 중 상태
    buttonLabel = isPaused ? "재개" : "일시정지"; // (기존 설정된 텍스트에 맞게 유지)
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