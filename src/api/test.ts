// src/api/test.ts
import { axiosInstance } from './axios';

export interface TestSetupRequest {
  baseTestGroupName: string;
  targetRepoId: number;
  scenarioSerials: string[];
  targetBranch: string;
}

// ✨ setup API의 응답 DTO 추가
export interface TestSetupResponse {
  executionId: number; // 백엔드 응답 JSON 키값에 맞게 수정하세요
}

export const setupTest = async (projectId: string | number, data: TestSetupRequest): Promise<TestSetupResponse> => {
  const response = await axiosInstance.post<TestSetupResponse>(`/api/projects/${projectId}/tests/setup`, data);
  // 응답 데이터(executionId가 포함된 객체)를 반환
  return response.data; 
};

// ✨ 테스트 계획서 다운로드 API 함수 추가
export const downloadTestPlan = async (projectId: string | number, executionId: number) => {
  // S3 리다이렉트를 처리하고 파일을 받기 위해 반드시 'blob' 타입 지정
  const response = await axiosInstance.get(
    `/api/projects/${projectId}/tests/executions/${executionId}/download/plan`,
    { responseType: 'blob' }
  );

  // 브라우저에서 엑셀 파일 다운로드를 강제 실행하는 로직
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `테스트계획서_${executionId}.xlsx`); // 임의의 파일명 지정
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
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