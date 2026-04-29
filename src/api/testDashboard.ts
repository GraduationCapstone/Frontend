import { axiosInstance } from "./axios";

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

export interface UpdateTestDashboardGroupNameRequest {
  newGroupName: string;
}

export interface UpdateTestDashboardCodeNameRequest {
  newTestCodeName: string;
}

// ==========================================
// 1. 테스트 그룹 조회 (GET)
// ==========================================

export const fetchTestDashboardGroup = async <T = TestDashboardGroupResponse>(
  projectId: IdParam,
  groupId: IdParam
): Promise<T> => {
  const response = await axiosInstance.get<T>(
    `/api/projects/${projectId}/tests/groups/${groupId}`
  );
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
