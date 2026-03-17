export type GithubRepo = {
    id: number;
    repoName: string;
    owner: string;
    description: string;
    language: string;
    forksCount: number;
    stargazersCount: number;
    openIssuesCount: number;
    user: string;
  };
  
  export type ProjectRepo = {
    id: number;
    project: string;
    githubRepo: GithubRepo;
  };
  
  export type Project = {
    id: number;
    projectName: string;
    projectRepos: ProjectRepo[];
    members: string[];
  };
  
  export type ProjectMember = {
    id: number;
    project: Project;
    user: string;
  };
  
  export type UserMeResponse = {
    id: number;
    githubId: string;
    username: string;
    email: string;
    deleted: boolean;
    githubAccessToken: string;
    projectMembers: ProjectMember[];
  };