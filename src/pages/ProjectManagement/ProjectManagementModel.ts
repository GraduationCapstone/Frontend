import { useMemo, useState } from "react";
import type { ProjectDetail, ProjectListItem, Member, AvgTestTimePoint } from "./types";
import type { TestCodeItem } from "../TEDashBoard/types";

const makeTests = (projectId: string): TestCodeItem[] => {
  const base: Array<Pick<TestCodeItem, "codeId" | "title" | "status" | "duration" | "user" | "date">> = [
    { codeId: "T1234", title: "test", status: "70.7%", duration: "48s", user: "User1234", date: "2025-09-09 15:34" },
    { codeId: "T1235", title: "login spec", status: "88.2%", duration: "35s", user: "User7788", date: "2025-09-09 15:10" },
    { codeId: "T1236", title: "routing spec", status: "63.0%", duration: "52s", user: "User1234", date: "2025-09-09 14:58" },
    { codeId: "T1237", title: "table spec", status: "91.4%", duration: "29s", user: "User0001", date: "2025-09-09 14:31" },
    { codeId: "T1238", title: "settings spec", status: "77.7%", duration: "41s", user: "User2222", date: "2025-09-09 14:02" },
  ];

  return base.map((b, idx) => ({
    id: `${projectId}-${b.codeId}-${idx}`,
    ...b,
  }));
};

const makeAvgSeries = (): AvgTestTimePoint[] => [
  { date: "2025-09-04", seconds: 160 },
  { date: "2025-09-05", seconds: 330 },
  { date: "2025-09-06", seconds: 250 },
  { date: "2025-09-07", seconds: 280 },
  { date: "2025-09-08", seconds: 210 },
  { date: "2025-09-09", seconds: 185 },
];

const SEED_PROJECTS: ProjectListItem[] = [
  { id: "P1234", code: "P1234", name: "Project A", tags: ["TypeScript", "TypeScript", "TypeScript"], updatedText: "Updated 1 hour ago" },
  { id: "P2345", code: "P2345", name: "Project B", tags: ["TypeScript", "TypeScript", "TypeScript"], updatedText: "Updated 1 hour ago" },
  { id: "P3456", code: "P3456", name: "Project C", tags: ["TypeScript", "TypeScript", "TypeScript"], updatedText: "Updated 1 hour ago" },
  { id: "P4567", code: "P4567", name: "Project D", tags: ["TypeScript", "TypeScript", "TypeScript"], updatedText: "Updated 1 hour ago" },
];

const SEED_MEMBERS: Member[] = [
  { id: "u1", username: "User1234" },
  { id: "u2", username: "User7788" },
  { id: "u3", username: "User0001" },
  { id: "u4", username: "User2222" },
];

const buildSeedDetails = (): Record<string, ProjectDetail> => {
  const makeDetail = (id: string, name: string): ProjectDetail => ({
    id,
    name,
    summary: {
      passRateText: "77.1% Pass",
      testedText: "47 / 50 Tested",
      counts: { pass: 44, block: 1, fail: 2, untest: 3 },
    },
    avgTestTime: makeAvgSeries(),
    tests: makeTests(id),
    members: SEED_MEMBERS,
  });

  return {
    P1234: makeDetail("P1234", "Project A"),
    P2345: makeDetail("P2345", "Project B"),
    P3456: makeDetail("P3456", "Project C"),
    P4567: makeDetail("P4567", "Project D"),
  };
};

export default function useProjectManagementModel() {
  const [projects, setProjects] = useState<ProjectListItem[]>(SEED_PROJECTS);
  const [detailsById, setDetailsById] = useState<Record<string, ProjectDetail>>(buildSeedDetails);

  const getProject = (projectId: string) => projects.find((p) => p.id === projectId) ?? null;

  const getDetail = (projectId: string) => detailsById[projectId] ?? null;

  const saveSettings = (projectId: string, nextName: string, nextMembers: Member[]) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, name: nextName } : p))
    );

    setDetailsById((prev) => {
      const cur = prev[projectId];
      if (!cur) return prev;
      return { ...prev, [projectId]: { ...cur, name: nextName, members: nextMembers } };
    });
  };

  const allGithubCandidates = useMemo<Member[]>(() => {
    // 실제론 API로 받아오겠지만 지금은 가라 후보
    return [
      ...SEED_MEMBERS,
      { id: "u5", username: "User9999" },
      { id: "u6", username: "User3141" },
      { id: "u7", username: "User2718" },
    ];
  }, []);

  return {
    projects,
    getProject,
    getDetail,
    saveSettings,
    allGithubCandidates,
  };
}
