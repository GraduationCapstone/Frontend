// src/api/github.ts
import { axiosInstance } from './axios';

// 백엔드 API 응답 타입 정의
export interface GithubRepoResponse {
  repoName: string;
  owner: string;
  description: string | null;
  language: string | null;
  forksCount: number;
  stargazersCount: number;
  openIssuesCount: number;
}

// 레포지토리 목록 가져오기 API 함수
export const fetchGithubRepos = async (): Promise<GithubRepoResponse[]> => {
  const response = await axiosInstance.get<GithubRepoResponse[]>('/api/github/repos/list');
  return response.data;
};

// ==========================================
// 레포지토리 선택(저장) API
// ==========================================
export interface PostRepoRequest {
  repoName: string;
  owner: string;
  description: string | undefined;
  language: string | undefined;
  forksCount: number;
  stargazersCount: number;
  openIssuesCount: number;
}

export interface PostRepoResponse extends PostRepoRequest {
  id: number;
}

export const postSelectedRepo = async (data: PostRepoRequest): Promise<PostRepoResponse> => {
  const response = await axiosInstance.post<PostRepoResponse>('/api/github/repos', data);
  return response.data;
};