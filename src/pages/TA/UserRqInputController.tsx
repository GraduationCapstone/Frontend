// src/pages/Home/TA/UserRqInputController.tsx
import { useEffect } from "react";
import { useUserRqInputModel } from "./UserRqInputModel";
import UserRqInputView from "./UserRqInputView";

export default function UserRqInputController() {
  const model = useUserRqInputModel();

  useEffect(() => {
    let timer: number;

    // 모달이 열려있고, 일시정지 상태가 아닐 때만 동작
    if (model.isTestProcessModalOpen && !model.isTestPaused) {
      timer = window.setInterval(() => {
        
        // 1단계: 코드 생성 중 (5초)
        if (model.testProcessStage === "generating") {
          model.setCodeGenTime((prev) => {
            if (prev >= 4) { // 5초 도달 시 다음 단계로
              model.setTestProcessStage("testing");
              return 5;
            }
            return prev + 1;
          });
        }
        
        // 2단계: 테스트 중 (5초)
        else if (model.testProcessStage === "testing") {
          model.setTestRunTime((prev) => {
            if (prev >= 4) { // 5초 도달 시 완료 단계로
              model.setTestProcessStage("complete");
              return 5;
            }
            return prev + 1;
          });
        }
        // 3단계: 보고서 생성 (5초)
        else if (model.testProcessStage === "report_generating") {
          model.setReportGenTime((prev) => {
            if (prev >= 4) {
              model.setTestProcessStage("report_complete");
              return 5;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [model.isTestProcessModalOpen, model.isTestPaused, model.testProcessStage]);

  // [NEW] 핸들러 추가
  const handleTogglePause = () => {
    model.setIsTestPaused((prev) => !prev);
  };

  const handleCloseTestModal = () => {
    model.setIsTestProcessModalOpen(false);
  };

  // '테스트 결과 보고서 생성' 버튼 클릭 시 -> 보고서 생성 단계로 진입
  const handleGenerateReport = () => {
    model.setTestProcessStage("report_generating");
    model.setReportGenTime(0);
    model.setIsTestPaused(false);
  };

  // '대시보드로 이동' 버튼 클릭 시
  const handleGoToDashboard = () => {
    console.log("대시보드로 이동");
    model.setIsTestProcessModalOpen(false);
  };

  return (
    <UserRqInputView
      {...model}
      handleCloseTestModal={handleCloseTestModal}
      handleTogglePause={handleTogglePause}
      handleGenerateReport={handleGenerateReport}
      handleGoToDashboard={handleGoToDashboard}
    />
  );
}