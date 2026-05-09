// src/api/test.ts
import { axiosInstance } from './axios';

export interface TestSetupRequest {
  baseTestGroupName: string;
  targetRepoId: number;
  scenarioSerials: string[];
  targetBranch: string;
  optionalServerUrl?: string;
}

// ✨ setup API의 응답 DTO 추가
export interface TestSetupResponse {
  executionId: number; // 백엔드 응답 JSON 키값에 맞게 수정하세요
}

export const setupTest = async (projectId: string | number, data: TestSetupRequest): Promise<number[]> => {
  const response = await axiosInstance.post<number[]>(`/api/projects/${projectId}/tests/setup`, data);
  // 백엔드가 [9007199254740991] 처럼 배열을 주므로 response.data를 그대로 반환
  return response.data; 
};

// ✨ 테스트 계획서 다운로드 API 함수 추가
export const downloadTestPlan = async (projectId: string | number, executionId: number) => {
  const response = await axiosInstance.get(
    `/api/projects/${projectId}/tests/executions/${executionId}/download/plan`,
  );

  // 2. 백엔드가 넘겨준 JSON 데이터에서 URL 꺼내기
  // 🚨 확인 필요: 백엔드가 URL을 담아준 정확한 Key 이름을 사용해야 합니다. (예: url, presignedUrl, downloadUrl 등)
  const downloadUrl = response.data.url; 

  // 3. 받아온 URL을 이용해 브라우저 단에서 직접 다운로드 실행 (CORS 에러 발생하지 않음)
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const checkTestNameDuplicate = async (projectId: string, name: string): Promise<boolean> => {
  const response = await axiosInstance.get(`/api/projects/${projectId}/tests/check-duplicate`, {
    params: { name } 
  });
  return response.data; // true or false 반환
};

// ✨ 테스트 실행(Dispatch) 요청 함수 추가
export const dispatchTest = async (executionId: number): Promise<void> => {
  await axiosInstance.post('/api/agent/dispatch/test', { 
    executionId // 백엔드 요구 규격: { "executionId": number }
  });
};

export const fetchExecutionStatus = async (projectId: string | number, executionId: number): Promise<string> => {
  const response = await axiosInstance.get(`/api/projects/${projectId}/tests/executions/${executionId}/status`);
  return response.data.status; // 'PLAN_COMPLETED', 'TESTING' 등 반환
};