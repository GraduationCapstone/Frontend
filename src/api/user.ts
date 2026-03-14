// src/api/user.ts
import { axiosInstance } from './axios';

// 응답 데이터에 맞춰 타입 정의 (사이드시트에서 쓸 핵심 데이터 위주)
export interface ProjectData {
  id: number;
  projectName: string;
  // 프로젝트 내부 세부 정보는 필요할 경우 확장하여 사용
  projectRepos?: any[]; 
  members?: string[];
}

export interface ProjectMember {
  id: number;
  project: ProjectData;
  user: string;
}

export interface UserMeResponse {
  id: number;
  githubId: string;
  username: string;
  email: string;
  deleted: boolean;
  githubAccessToken: string;
  projectMembers: ProjectMember[];
}

// 본인 정보 조회 API
export const fetchUserMe = async (): Promise<UserMeResponse> => {
  const response = await axiosInstance.get<UserMeResponse>('/api/user/me');
  return response.data;
};