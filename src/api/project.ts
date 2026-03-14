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