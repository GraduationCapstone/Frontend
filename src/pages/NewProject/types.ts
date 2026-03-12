// 검색 및 초대할 유저 데이터 타입
export interface User {
  id: string;
  name: string; // 현재는 Github ID처럼 쓰이지만, 초대 API 테스트를 위해 이메일 형식으로 입력 필요
}

// [POST] /api/projects 요청(Request) 데이터 타입
export interface CreateProjectRequest {
  projectName: string;
  repoIds: number[]; 
}

// [POST] /api/projects 성공 응답(Response) 데이터 타입
export interface CreateProjectResponse {
  id: number;
  projectName: string;
  memberCount: number;
  repoCount: number;
}

// [POST] /api/projects/{projectId}/invite 요청 데이터 타입
export interface InviteMembersRequest {
  emails: string[];
}