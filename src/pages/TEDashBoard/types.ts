export type TestStatus = "Pass" | "Block" | "Fail" | "Untest";

export type SortKey = "codeId" | "title" | "status" | "duration" | "user" | "date";

export type TestCodeItem = {
  id: string;
  codeId: string;
  title: string;
  status: TestStatus;
  duration?: string;
  user?: string;
  date?: string;
};

export type Summary = {
  pass: number;
  block: number;
  fail: number;
  untest: number;
};

export type TEDashBoardData = {
  projectTitle: string;
  totalCount: number;
  testedCount: number;
  summary: Summary;
  list: TestCodeItem[];
};
