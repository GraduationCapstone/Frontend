import { useMemo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTEDashBoardData } from './TEDashBoardModel';
import {
  downloadTestDashboardReport,
  fetchProjectTestSummaryList,
  fetchTestDashboardGroup,
  updateTestDashboardGroupName,
} from '../../api/testDashboard';
import { downloadTestPlan } from '../../api/test';
import useTEDashBoard from '../../hooks/useTEDashBoard';
import TEDashBoardView from './TEDashBoardView';
import type { TEDashBoardData } from './types';
import type { ProjectTestSummaryListItem } from '../../api/testDashboard';

type DashboardRouteState = {
  projectId?: string | number;
  targetProjectId?: string | number;
  groupId?: string | number;
  testGroupId?: string | number;
  executionId?: string | number;
};

const toParam = (value: unknown): string | number | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return undefined;
};

const normalizeGroupName = (value: string | null | undefined): string =>
  value?.replace(/\s+/g, '').trim() ?? '';

const filterResultsByGroupName = (
  results: ProjectTestSummaryListItem[],
  groupName: string
): ProjectTestSummaryListItem[] => {
  const targetGroupName = normalizeGroupName(groupName);
  if (!targetGroupName) return results;

  return results.filter((result) => normalizeGroupName(result.testGroupName) === targetGroupName);
};

type TEDashBoardContentProps = {
  data: TEDashBoardData;
  onSaveTitle: (title: string) => Promise<void>;
  onDownloadTestPlan: () => void;
  onDownloadTestReport: () => void;
};

function TEDashBoardContent({
  data,
  onSaveTitle,
  onDownloadTestPlan,
  onDownloadTestReport,
}: TEDashBoardContentProps) {
  const state = useTEDashBoard(data.list, data.projectTitle, onSaveTitle);

  return (
    <TEDashBoardView
      data={data}
      state={state}
      onDownloadTestPlan={onDownloadTestPlan}
      onDownloadTestReport={onDownloadTestReport}
    />
  );
}

const openDownloadUrl = (downloadData: Record<string, string>) => {
  const downloadUrl = Object.values(downloadData).find((value) => value.startsWith('http'));
  if (!downloadUrl) return;

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default function TEDashBoardController() {
  const location = useLocation();

  const dashboardParams = useMemo(() => {
    const routeState = (location.state ?? {}) as DashboardRouteState;
    const searchParams = new URLSearchParams(location.search);

    return {
      projectId:
        toParam(routeState.projectId) ??
        toParam(routeState.targetProjectId) ??
        toParam(searchParams.get('projectId')),
      groupId:
        toParam(routeState.groupId) ??
        toParam(routeState.testGroupId) ??
        toParam(searchParams.get('groupId')) ??
        toParam(searchParams.get('testGroupId')),
      executionId:
        toParam(routeState.executionId) ??
        toParam(searchParams.get('executionId')) ??
        toParam(routeState.groupId) ??
        toParam(routeState.testGroupId) ??
        toParam(searchParams.get('groupId')) ??
        toParam(searchParams.get('testGroupId')),
    };
  }, [location.search, location.state]);

  const [data, setData] = useState<TEDashBoardData>(() => getTEDashBoardData());

  useEffect(() => {
    const { projectId, groupId } = dashboardParams;
    if (!projectId || !groupId) {
      setData(getTEDashBoardData());
      return;
    }

    let cancelled = false;

    const loadDashboardGroup = async () => {
      setData(getTEDashBoardData());

      try {
        console.log('[TEDashBoard] 조회 파라미터:', { projectId, groupId });
        const [group, results] = await Promise.all([
          fetchTestDashboardGroup(projectId, groupId),
          fetchProjectTestSummaryList(projectId).catch((error) => {
            console.error('[TEDashBoard] 테스트 코드 목록 조회 실패:', error);
            return [];
          }),
        ]);
        if (cancelled) return;

        const filteredResults = filterResultsByGroupName(results, group.groupName);

        console.log('[TEDashBoard] 그룹 응답:', group);
        console.log('[TEDashBoard] 테스트 코드 목록 응답:', results);
        console.log('[TEDashBoard] 그룹명 필터링 결과:', filteredResults);
        setData(getTEDashBoardData({ group, results: filteredResults }));
      } catch (error) {
        if (cancelled) return;

        console.error('[TEDashBoard] 테스트 그룹 조회 실패:', error);
      }
    };

    loadDashboardGroup();

    return () => {
      cancelled = true;
    };
  }, [dashboardParams]);

  const dashboardKey = useMemo(() => {
    const { projectId, groupId } = dashboardParams;
    return `${projectId ?? 'none'}-${groupId ?? 'none'}-${data.projectTitle}-${data.totalCount}`;
  }, [dashboardParams, data.projectTitle, data.totalCount]);

  const handleSaveTitle = async (title: string) => {
    const { projectId, groupId } = dashboardParams;
    if (!projectId || !groupId) return;

    await updateTestDashboardGroupName(projectId, groupId, title);
    setData((prev) => ({ ...prev, projectTitle: title }));
    console.log('[TEDashBoard] 테스트 그룹명 수정 API 연결 완료');
  };

  const handleDownloadTestPlan = async () => {
    const { projectId, executionId } = dashboardParams;
    if (!projectId || !executionId) return;

    await downloadTestPlan(projectId, executionId);
    console.log('[TEDashBoard] 테스트 계획서 다운로드 API 연결 완료');
  };

  const handleDownloadTestReport = async () => {
    const { projectId, executionId } = dashboardParams;
    if (!projectId || !executionId) return;

    const downloadData = await downloadTestDashboardReport(projectId, executionId);
    openDownloadUrl(downloadData);
    console.log('[TEDashBoard] 테스트 결과 보고서 다운로드 API 연결 완료', downloadData);
  };

  return (
    <TEDashBoardContent
      key={dashboardKey}
      data={data}
      onSaveTitle={handleSaveTitle}
      onDownloadTestPlan={handleDownloadTestPlan}
      onDownloadTestReport={handleDownloadTestReport}
    />
  );
}
