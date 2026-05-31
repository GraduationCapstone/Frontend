import { useUserRqInputModel } from './UserRqInputModel';
import UserRqInputView from './UserRqInputView';
import { useNavigate } from 'react-router-dom';
import { fetchTestDashboardBasicList } from '../../api/testDashboard';

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
//   const handleGenerateReport = () => {
//     model.setTestProcessStage('report_generating');
//     model.setReportGenTime(0);
//     model.setIsTestPaused(false);
//   };

  // '대시보드로 이동' 버튼 클릭 시
  const handleGoToDashboard = async () => {
    console.log('대시보드로 이동');
    model.setIsTestProcessModalOpen(false);

    if (model.targetProjectId && model.dashboardGroupId) {
      const projectId = String(model.targetProjectId);
      const executionId = String(model.dashboardGroupId);
      let groupId = executionId;
      let groupName: string | undefined;
      let testCaseId: string | undefined;

      try {
        const tests = await fetchTestDashboardBasicList(projectId);
        const target =
          tests.find((test) => String(test.executionId ?? '') === executionId) ??
          tests.find((test) => String(test.groupId ?? test.testGroupId ?? '') === executionId);
        const resolvedGroupId = target?.groupId ?? target?.testGroupId;

        if (resolvedGroupId) groupId = String(resolvedGroupId);
        if (target?.testGroupName) groupName = target.testGroupName;
        if (target?.testCaseId) testCaseId = target.testCaseId;
      } catch (error) {
        console.error('[UserRqInput] 대시보드 식별자 조회 실패:', error);
      }

      const params = new URLSearchParams({
        projectId,
        groupId,
        executionId,
      });
      if (groupName) params.set('groupName', groupName);
      if (testCaseId) params.set('testCaseId', testCaseId);
      navigate(`/test-dashboard?${params.toString()}`);
      return;
    }

    navigate('/test-dashboard');
  };

  return (
    <UserRqInputView
      {...model}
      handleCloseTestModal={handleCloseTestModal}
      handleTogglePause={handleTogglePause}
      handleGoToDashboard={handleGoToDashboard}
    />
  );
}
