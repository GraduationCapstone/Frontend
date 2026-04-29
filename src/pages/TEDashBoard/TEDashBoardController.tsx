import { useMemo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTEDashBoardData } from './TEDashBoardModel';
import { fetchTestDashboardBasicList, fetchTestDashboardGroup } from '../../api/testDashboard';
import { fetchProjectMembers } from '../../api/project';
import useTEDashBoard from '../../hooks/useTEDashBoard';
import TEDashBoardView from './TEDashBoardView';
import type { TEDashBoardData } from './types';

type DashboardRouteState = {
  projectId?: string | number;
  targetProjectId?: string | number;
  groupId?: string | number;
  testGroupId?: string | number;
};

const toParam = (value: unknown): string | number | undefined => {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return undefined;
};

function TEDashBoardContent({ data }: { data: TEDashBoardData }) {
  const state = useTEDashBoard(data.list, data.projectTitle);

  return <TEDashBoardView data={data} state={state} />;
}

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
        const [group, results, members] = await Promise.all([
          fetchTestDashboardGroup(projectId, groupId),
          fetchTestDashboardBasicList(projectId, groupId).catch((error) => {
            console.error('[TEDashBoard] 테스트 코드 목록 조회 실패:', error);
            return [];
          }),
          fetchProjectMembers(Number(projectId)).catch((error) => {
            console.error('[TEDashBoard] 프로젝트 멤버 조회 실패:', error);
            return [];
          }),
        ]);
        if (cancelled) return;

        setData(getTEDashBoardData({ group, results, members }));
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

  return <TEDashBoardContent key={dashboardKey} data={data} />;
}
