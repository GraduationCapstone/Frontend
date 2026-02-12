import { useUserRqInputModel } from "./UserRqInputModel";
import UserRqInputView from "./UserRqInputView";

export default function UserRqInputController() {
  const model = useUserRqInputModel();

  // 핸들러 추가
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