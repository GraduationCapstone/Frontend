import { useUserRqInputModel } from './UserRqInputModel';
import UserRqInputView from './UserRqInputView';
import { useNavigate } from 'react-router-dom';

export default function UserRqInputController() {
  const model = useUserRqInputModel();
  const navigate = useNavigate();

  // 핸들러 추가
  const handleTogglePause = () => {
    model.setIsTestPaused((prev) => !prev);
  };

  const handleCloseTestModal = () => {
    model.setIsTestProcessModalOpen(false);
  };

  // '테스트 결과 보고서 생성' 버튼 클릭 시 -> 보고서 생성 단계로 진입
  const handleGenerateReport = () => {
    model.setTestProcessStage('report_generating');
    model.setReportGenTime(0);
    model.setIsTestPaused(false);
  };

  // '대시보드로 이동' 버튼 클릭 시
  const handleGoToDashboard = () => {
    console.log('대시보드로 이동');
    model.setIsTestProcessModalOpen(false);
    navigate('/test-dashboard', {
      state: {
        projectId: model.targetProjectId,
        groupId: model.dashboardGroupId,
      },
    });
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
