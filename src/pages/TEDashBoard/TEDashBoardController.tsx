import { useMemo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTEDashBoardData } from './TEDashBoardModel';
import {
  deleteTestDashboardCode,
  downloadTestDashboardReport,
  fetchProjectTestSummaryList,
  fetchTestDashboardBasicList,
  fetchTestDashboardGroup,
  fetchTestExecutionStats,
  updateTestDashboardCodeName,
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
  groupName?: string;
  testGroupName?: string;
  testCaseId?: string | number;
  codeId?: string | number;
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

const getTestCasePrefix = (value: string | number | null | undefined): string => {
  const text = String(value ?? '').trim();
  return /^T\d{4}/.exec(text)?.[0] ?? text;
};

const filterResultsByTestCaseId = (
  results: ProjectTestSummaryListItem[],
  testCaseId?: string | number
): ProjectTestSummaryListItem[] => {
  const targetPrefix = getTestCasePrefix(testCaseId);
  if (!targetPrefix) return results;

  return results.filter((result) => {
    const currentTestCaseId = String(result.testCaseId ?? '').trim();
    return currentTestCaseId === targetPrefix || currentTestCaseId.startsWith(`${targetPrefix}_`);
  });
};

const filterDashboardResults = (
  results: ProjectTestSummaryListItem[],
  groupName?: string | number,
  testCaseId?: string | number
): ProjectTestSummaryListItem[] => {
  const testCaseFilteredResults = filterResultsByTestCaseId(results, testCaseId);
  if (testCaseId && testCaseFilteredResults.length > 0) return testCaseFilteredResults;

  return filterResultsByGroupName(results, String(groupName ?? ''));
};

type DashboardBasicIds = {
  executionId?: string | number;
};

const resolveDashboardBasicIdsByGroupId = async (
  projectId: string | number,
  groupId?: string | number
): Promise<DashboardBasicIds> => {
  if (!groupId) return {};

  const tests = await fetchTestDashboardBasicList(projectId, groupId);
  const target = tests.find((test) => {
    const testGroupId = test.groupId ?? test.testGroupId;
    return String(testGroupId ?? '') === String(groupId);
  }) ?? tests[0];

  return {
    executionId: toParam(target?.executionId),
  };
};

type TEDashBoardContentProps = {
  data: TEDashBoardData;
  projectId?: string | number;
  onSaveTitle: (title: string) => Promise<void>;
  onSaveTestCodeTitle: (id: string, title: string) => Promise<void>;
  onDeleteTestCode: (id: string) => Promise<void>;
  onDownloadTestPlan: () => void;
  onDownloadTestReport: () => void;
};

function TEDashBoardContent({
  data,
  projectId,
  onSaveTitle,
  onSaveTestCodeTitle,
  onDeleteTestCode,
  onDownloadTestPlan,
  onDownloadTestReport,
}: TEDashBoardContentProps) {
  const state = useTEDashBoard(data.list, data.projectTitle, onSaveTitle);

  return (
    <TEDashBoardView
      data={data}
      projectId={projectId}
      state={state}
      onSaveTestCodeTitle={onSaveTestCodeTitle}
      onDeleteTestCode={onDeleteTestCode}
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
      groupName:
        toParam(routeState.groupName) ??
        toParam(routeState.testGroupName) ??
        toParam(searchParams.get('groupName')) ??
        toParam(searchParams.get('testGroupName')),
      testCaseId:
        toParam(routeState.testCaseId) ??
        toParam(routeState.codeId) ??
        toParam(searchParams.get('testCaseId')) ??
        toParam(searchParams.get('codeId')),
      executionId:
        toParam(routeState.executionId) ??
        toParam(searchParams.get('executionId')),
    };
  }, [location.search, location.state]);

  const [data, setData] = useState<TEDashBoardData>(() => getTEDashBoardData());
  const [resolvedExecutionId, setResolvedExecutionId] = useState<string | number | undefined>();

  useEffect(() => {
    const { projectId, groupId, groupName, testCaseId, executionId } = dashboardParams;
    if (!projectId || (!groupId && !groupName)) {
      setData(getTEDashBoardData());
      setResolvedExecutionId(undefined);
      return;
    }

    let cancelled = false;

    const loadDashboardGroup = async () => {
      setData(getTEDashBoardData());
      setResolvedExecutionId(executionId);

      try {
        if (!groupId) {
          const [results, stats] = await Promise.all([
            fetchProjectTestSummaryList(projectId).catch((error) => {
              console.error('[TEDashBoard] 테스트 코드 목록 조회 실패:', error);
              return [];
            }),
            executionId
              ? fetchTestExecutionStats(projectId, executionId).catch((error) => {
                  console.error('[TEDashBoard] 테스트 통계 조회 실패:', error);
                  return null;
                })
              : Promise.resolve(null),
          ]);
          if (cancelled) return;

          const resolvedGroupName = String(groupName ?? '');
          const filteredResults = filterDashboardResults(results, resolvedGroupName, testCaseId);
          setResolvedExecutionId(executionId);

          setData(
            getTEDashBoardData({
              group: { groupId: '', projectId, groupName: resolvedGroupName },
              results: filteredResults,
              stats,
            })
          );
          return;
        }

        const isSameAsGroupId = String(executionId ?? '') === String(groupId ?? '');
        const resolvedBasicIds: DashboardBasicIds =
          !executionId || isSameAsGroupId
            ? await resolveDashboardBasicIdsByGroupId(projectId, groupId).catch((error) => {
                console.error('[TEDashBoard] 테스트 기본 식별자 조회 실패:', error);
                return {};
              })
            : {};
        if (cancelled) return;

        const shouldUseBasicExecutionId =
          isSameAsGroupId &&
          resolvedBasicIds.executionId &&
          String(resolvedBasicIds.executionId) !== String(groupId);
        const statsExecutionId = shouldUseBasicExecutionId
          ? resolvedBasicIds.executionId
          : executionId ?? resolvedBasicIds.executionId;
        const [group, results, stats] = await Promise.all([
          fetchTestDashboardGroup(projectId, groupId),
          fetchProjectTestSummaryList(projectId, groupId).catch((error) => {
            console.error('[TEDashBoard] 테스트 코드 목록 조회 실패:', error);
            return [];
          }),
          statsExecutionId
            ? fetchTestExecutionStats(projectId, statsExecutionId).catch((error) => {
                console.error('[TEDashBoard] 테스트 통계 조회 실패:', error);
                return null;
              })
            : Promise.resolve(null),
        ]);
        if (cancelled) return;

        const resolvedTestCaseId = testCaseId;
        setResolvedExecutionId(statsExecutionId);
        const displayGroup = groupName ? { ...group, groupName: String(groupName) } : group;

        setData(
          getTEDashBoardData({
            group: displayGroup,
            results: filterDashboardResults(results, displayGroup.groupName, resolvedTestCaseId),
            stats,
          })
        );
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
    const { projectId, groupId, groupName } = dashboardParams;
    return `${projectId ?? 'none'}-${groupId ?? groupName ?? 'none'}-${data.projectTitle}-${data.totalCount}`;
  }, [dashboardParams, data.projectTitle, data.totalCount]);

  const handleSaveTitle = async (title: string) => {
    const { projectId, groupId } = dashboardParams;
    if (!projectId || !groupId) return;

    await updateTestDashboardGroupName(projectId, groupId, title);
    setData((prev) => ({ ...prev, projectTitle: title }));
  };

  const handleSaveTestCodeTitle = async (id: string, title: string) => {
    const { projectId } = dashboardParams;
    if (!projectId) return;

    const target = data.list.find((item) => item.id === id);
    const resultId = target?.resultId;
    if (!resultId) {
      const message =
        '[TEDashBoard] 테스트 코드명 수정에 필요한 숫자 resultId가 없습니다. /tests/list/summary 응답에 resultId를 내려줘야 합니다.';
      console.error(message, { projectId, id, target });
      throw new Error(message);
    }

    await updateTestDashboardCodeName(projectId, resultId, title);
    setData((prev) => ({
      ...prev,
      list: prev.list.map((item) => (item.id === id ? { ...item, title } : item)),
    }));
  };

  const handleDeleteTestCode = async (id: string) => {
    const { projectId } = dashboardParams;
    if (!projectId) return;

    const target = data.list.find((item) => item.id === id);
    const resultId = target?.resultId;
    if (!resultId) {
      const message =
        '[TEDashBoard] 테스트 코드 삭제에 필요한 숫자 resultId가 없습니다. /tests/list/summary 응답에 resultId를 내려줘야 합니다.';
      console.error(message, { projectId, id, target });
      throw new Error(message);
    }

    await deleteTestDashboardCode(projectId, resultId);
    setData((prev) => ({
      ...prev,
      list: prev.list.filter((item) => item.id !== id),
    }));
  };

  const handleDownloadTestPlan = async () => {
    const { projectId } = dashboardParams;
    const executionId = resolvedExecutionId ?? dashboardParams.executionId;
    if (!projectId || !executionId) return;

    await downloadTestPlan(projectId, executionId);
  };

  const handleDownloadTestReport = async () => {
    const { projectId } = dashboardParams;
    const executionId = resolvedExecutionId ?? dashboardParams.executionId;
    if (!projectId || !executionId) return;

    const downloadData = await downloadTestDashboardReport(projectId, executionId);
    openDownloadUrl(downloadData);
  };

  return (
    <TEDashBoardContent
      key={dashboardKey}
      data={data}
      projectId={dashboardParams.projectId}
      onSaveTitle={handleSaveTitle}
      onSaveTestCodeTitle={handleSaveTestCodeTitle}
      onDeleteTestCode={handleDeleteTestCode}
      onDownloadTestPlan={handleDownloadTestPlan}
      onDownloadTestReport={handleDownloadTestReport}
    />
  );
}
