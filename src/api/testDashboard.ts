import { axiosInstance } from './axios';

type IdParam = number | string;

export interface TestDashboardGroupResponse {
  groupId: IdParam;
  projectId: IdParam;
  groupName: string;
  targetRepoId?: IdParam;
  targetBranch?: string;
  results?: unknown[];
  testResults?: unknown[];
  testCodeResults?: unknown[];
  testCodes?: unknown[];
  list?: unknown[];
}

export interface TestDashboardBasicListItem {
  testCaseId: string | null;
  id?: string | null;
  groupId?: IdParam | null;
  testGroupId?: IdParam | null;
  executionId?: IdParam | null;
  testCodeName?: string | null;
  testGroupName?: string | null;
  status?: string | null;
  passRatio?: string | null;
  duration?: string | null;
  testDuration?: string | null;
  tester?: string | null;
  testerName?: string | null;
  completedAt?: string | null;
  executedAt?: string | null;
  createdAt?: string | null;
}

export type TestDashboardBasicListResponse = TestDashboardBasicListItem[];

export interface ProjectTestSummaryListItem {
  testCaseId: string | null;
  id?: string | null;
  groupId?: IdParam | null;
  testGroupId?: IdParam | null;
  executionId?: IdParam | null;
  testCodeName?: string | null;
  testGroupName?: string | null;
  status?: string | null;
  passRatio: string | null;
  duration?: string | null;
  testDuration?: string | null;
  tester?: string | null;
  testerName?: string | null;
  completedAt?: string | null;
  executedAt?: string | null;
  createdAt?: string | null;
}

export type ProjectTestSummaryListResponse = ProjectTestSummaryListItem[];

export interface ProjectGlobalTestStatsResponse {
  passCount: number;
  totalCount: number;
  countString: string;
  passRatio: string;
}

export interface UpdateTestDashboardGroupNameRequest {
  newGroupName: string;
}

export interface UpdateTestDashboardCodeNameRequest {
  newTestCodeName: string;
}

export type TestDashboardReportDownloadResponse = Record<string, string>;

// ==========================================
// 1. 테스트 그룹 조회 (GET)
// ==========================================

export const fetchTestDashboardGroup = async <T = TestDashboardGroupResponse>(
  projectId: IdParam,
  groupId: IdParam
): Promise<T> => {
  const response = await axiosInstance.get<T>(`/api/projects/${projectId}/tests/groups/${groupId}`);
  return response.data;
};

// ==========================================
// 1.2 테스트 그룹 내 테스트 코드 목록 조회 (GET)
// ==========================================

export const fetchTestDashboardBasicList = async <T = TestDashboardBasicListResponse>(
  projectId: IdParam,
  groupId?: IdParam
): Promise<T> => {
  console.log('[test basic request]', { projectId, groupId });
  const response = await axiosInstance.get<T>(`/api/projects/${projectId}/tests/list/basic`, {
    params: groupId === undefined ? undefined : { groupId },
  });
  console.log('[test basic response]', response.data);
  return response.data;
};

// ==========================================
// 2. 테스트 그룹명 수정 (PATCH)
// ==========================================

export const updateTestDashboardGroupName = async (
  projectId: IdParam,
  groupId: IdParam,
  newGroupName: string
): Promise<void> => {
  const body: UpdateTestDashboardGroupNameRequest = { newGroupName };
  await axiosInstance.patch(`/api/projects/${projectId}/tests/groups/${groupId}`, body);
};

// ==========================================
// 2.2 테스트 코드명 수정 (PATCH)
// ==========================================

export const updateTestDashboardCodeName = async (
  projectId: IdParam,
  resultId: IdParam,
  newTestCodeName: string
): Promise<void> => {
  const body: UpdateTestDashboardCodeNameRequest = { newTestCodeName };
  await axiosInstance.patch(`/api/projects/${projectId}/tests/results/${resultId}/name`, body);
};

// ==========================================
// 3. 테스트 코드 삭제 (DELETE)
// ==========================================

export const deleteTestDashboardCode = async (
  projectId: IdParam,
  resultId: IdParam
): Promise<void> => {
  await axiosInstance.delete(`/api/projects/${projectId}/tests/results/${resultId}`);
};

// ==========================================
// 4. 테스트 결과 보고서 다운로드 (GET)
// ==========================================

export const downloadTestDashboardReport = async (
  projectId: IdParam,
  executionId: IdParam
): Promise<TestDashboardReportDownloadResponse> => {
  const response = await axiosInstance.get<TestDashboardReportDownloadResponse>(
    `/api/projects/${projectId}/tests/executions/${executionId}/download/report`
  );
  return response.data;
};

// ============================================================
// ProjectManagement 페이지에서 사용할 API 
// ============================================================

// ==========================================
// 1. 프로젝트 내 테스트 코드 목록 조회 (GET)
// ==========================================

export const fetchProjectTestSummaryList = async <T = ProjectTestSummaryListResponse>(
  projectId: IdParam,
  groupId?: IdParam
): Promise<T> => {
  console.log('[test summary request]', { projectId, groupId });
  const response = await axiosInstance.get<T>(`/api/projects/${projectId}/tests/list/summary`, {
    params: groupId === undefined ? undefined : { groupId },
  });
  console.log('[test summary response]', response.data);
  return response.data;
};

// ==========================================
// 1-2. 프로젝트 내 테스트 코드 목록 중 비율 조회 (GET)
// ==========================================

export const fetchProjectGlobalTestStats = async <T = ProjectGlobalTestStatsResponse>(
  projectId: IdParam
): Promise<T> => {
  const response = await axiosInstance.get<T>(
    `/api/projects/${projectId}/tests/stats/project-global`
  );
  return response.data;
};
