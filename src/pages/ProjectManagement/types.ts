import type {
    SortKey,
    TestCodeItem,
    Summary as TEDSummary,
  } from "../TEDashBoard/types";
  
  // 기존처럼 re-export 유지
  export type { SortKey, TestCodeItem };
  
  // ProjectManagement에서도 Summary를 쓸 수 있게 export
  export type Summary = TEDSummary;
  
  export type ProjectListItem = {
    id: string;
    code: string;
    name: string;
    tags: string[];
    updatedText: string;
  };
  
  export type ProjectStatusCounts = Summary;
  
  export type ProjectSummary = {
    passRateText: string;
    testedText: string; // "47 / 50 Tested"
    counts: ProjectStatusCounts; // (= Summary)
  };
  
  export type AvgTestTimePoint = {
    date: string; // "2025-09-09"
    seconds: number; // 평균 테스트 시간(초)
  };
  
  export type Member = {
    id: string;
    username: string; // GitHub ID 같은 형태류
  };
  
  export type ProjectDetail = {
    id: string; // projectId
    name: string;
    summary: ProjectSummary;
    avgTestTime: AvgTestTimePoint[];
    tests: TestCodeItem[];
    members: Member[];
  };
  
  export type ProjectManagementMode = "list" | "detail" | "settings";
  