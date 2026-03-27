// src/api/project.ts
import { axiosInstance } from './axios';

// ==========================================
// 1. 참여 중인 프로젝트 목록 조회 (GET)
// ==========================================
export interface ProjectResponse {
  id: number;
  projectName: string;
  memberCount: number;
  repoCount: number;
}

export const fetchProjects = async (): Promise<ProjectResponse[]> => {
  const response = await axiosInstance.get<ProjectResponse[]>('/api/projects');
  return response.data;
};

// ==========================================
// 2. 새 프로젝트 생성 (POST)
// ==========================================
export interface CreateProjectRequest {
  projectName: string;
  repoIds: number[];
}

export interface CreateProjectResponse {
  id: number;
  projectName: string;
  memberCount: number;
  repoCount: number;
}

export const createProject = async (data: CreateProjectRequest): Promise<CreateProjectResponse> => {
  const response = await axiosInstance.post<CreateProjectResponse>('/api/projects', data);
  return response.data;
};

// ==========================================
// 3. 프로젝트 멤버 초대 (POST)
// ==========================================
export interface InviteMembersRequest {
  emails: string[];
}

// ✨ [추가] 멤버 초대 API 통신 함수
export const inviteMembers = async (projectId: number, data: InviteMembersRequest): Promise<void> => {
  await axiosInstance.post(`/api/projects/${projectId}/invite`, data);
};

// ==========================================
// 4. 특정 프로젝트의 레포지토리 목록 조회 (GET)
// ==========================================
export interface ProjectRepoResponse {
  id: number;
  repoName: string;
  owner: string;
  description: string | null;
  language: string | null;
  forksCount: number;
  stargazersCount: number;
  openIssuesCount: number;
}

export const fetchProjectRepos = async (projectId: number): Promise<ProjectRepoResponse[]> => {
  const response = await axiosInstance.get<ProjectRepoResponse[]>(`/api/projects/${projectId}/repos`);
  return response.data;
};

// ==========================================
// 4-1. 특정 프로젝트 멤버 목록 조회 (GET)
// ==========================================
export interface ProjectMemberResponse {
  userId: number;
  username: string;
  email: string;
  profileImageUrl: string;
  role: "OWNER" | "MEMBER";
}

export const fetchProjectMembers = async (projectId: number): Promise<ProjectMemberResponse[]> => {
  const response = await axiosInstance.get<ProjectMemberResponse[]>(`/api/projects/${projectId}/members`);
  return response.data;
};

// ==========================================
// 5. 유저 검색 (GET) - 초대 대상 탐색용
// ==========================================
export interface SearchUserResponse {
  userId: number;
  username: string;
  email: string;
  profileImageUrl: string;
}

export const searchUsers = async (keyword: string): Promise<SearchUserResponse[]> => {
  // 파라미터 이름이 keyword가 아니라면 아래 { keyword } 부분을 수정해 주세요!
  const response = await axiosInstance.get<SearchUserResponse[]>('/api/projects/users/search', {
    params: { keyword: keyword } 
  });
  return response.data;
};

// ==========================================
// 6. 프로젝트 삭제/나가기 (DELETE)
// ==========================================
export const deleteProject = async (projectId: number): Promise<void> => {
  await axiosInstance.delete(`/api/projects/${projectId}`);
};

export const leaveProjectAsMember = async (
  projectId: number,
  userId: number
): Promise<void> => {
  await axiosInstance.delete(`/api/projects/${projectId}/members/${userId}`);
};