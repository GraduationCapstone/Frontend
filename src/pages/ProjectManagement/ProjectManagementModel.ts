import { useEffect, useState } from "react";
import type {
  ProjectDetail,
  ProjectListItem,
  Member,
  AvgTestTimePoint,
  ProjectRolePreview,
  ProjectSummary,
  TestCodeItem,
} from "./types";
import type { ProjectMemberResponse, ProjectRepoResponse, ProjectResponse } from "../../api/project";
import {
  deleteProject,
  fetchProjectMembers,
  fetchProjectRepos,
  fetchProjects,
  leaveProjectAsMember,
} from "../../api/project";
import type {
  ProjectTestSummaryListItem,
  TestDashboardBasicListItem,
} from "../../api/testDashboard";
import {
  fetchProjectGlobalTestStats,
  fetchProjectTestSummaryList,
  fetchTestDashboardBasicList,
} from "../../api/testDashboard";
import { fetchUserMe } from "../../api/user";

type ProjectApiItem = ProjectResponse;
type CurrentUserIdentity = {
  id?: number;
  userId?: number;
  username?: string;
  githubId?: string;
  email?: string;
};
type ProjectListMetadata = {
  languages: string[];
  hostUsername: string;
  hostProfileImageUrl: string;
  members: Member[];
  myUserId: string;
  myRole: ProjectRolePreview;
  tests: TestCodeItem[];
  summary: ProjectSummary;
};

const formatProjectCode = (projectId: number): string =>
  `P${String(projectId).padStart(3, "0")}`;

const toProjectListItem = (
  project: ProjectApiItem,
  metadata: ProjectListMetadata
): ProjectListItem => ({
  id: String(project.id),
  code: formatProjectCode(project.id),
  name: project.projectName,
  tags: metadata.languages,
  hostUsername: metadata.hostUsername,
  hostProfileImageUrl: metadata.hostProfileImageUrl,
  updatedText: "",
});

const extractLanguagesFromRepos = (repos: ProjectRepoResponse[]): string[] => {
  const unique = new Set<string>();
  repos.forEach((repo) => {
    const lang = repo.language?.trim();
    if (!lang) return;
    unique.add(lang);
  });
  return Array.from(unique);
};

const sanitizeLanguageTags = (languages: string[]): string[] =>
  languages
    .map((language) => language.trim())
    .filter((language) => language.length > 0);

const normalizeMemberRole = (role: string | undefined): "OWNER" | "MEMBER" => {
  const normalized = role?.trim().toUpperCase() ?? "";
  return normalized.includes("OWNER") ? "OWNER" : "MEMBER";
};

const mapProjectMembers = (members: ProjectMemberResponse[]): Member[] =>
  members.map((member) => ({
    id: String(member.userId),
    username: member.username,
    email: member.email,
    profileImageUrl: member.profileImageUrl,
    role: normalizeMemberRole(member.role),
  }));

const getCurrentUserId = (currentUser: CurrentUserIdentity): number | undefined => {
  if (typeof currentUser.id === "number") return currentUser.id;
  if (typeof currentUser.userId === "number") return currentUser.userId;
  return undefined;
};

const toOptionalText = (value: string | null | undefined): string | undefined => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : undefined;
};

const toOptionalIdText = (value: string | number | null | undefined): string | undefined => {
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : undefined;
  return toOptionalText(value);
};

const formatCompletedAt = (completedAt: string | null | undefined): string | undefined => {
  const text = toOptionalText(completedAt);
  return text?.replace("T", " ").slice(0, 16);
};

const formatCodeId = (id: string): string => {
  const parts = id.split("_");
  if (parts.length !== 3 || parts[0] !== parts[1]) return id;
  return `${parts[0]}_${parts[2]}`;
};

type ProjectTestNameSource = Pick<
  TestDashboardBasicListItem | ProjectTestSummaryListItem,
  "testCodeName" | "testGroupName"
>;

const getProjectTestName = (test: ProjectTestNameSource): string | undefined =>
  toOptionalText(test.testGroupName) ?? toOptionalText(test.testCodeName);

const getNormalizedProjectTestName = (test: ProjectTestNameSource): string | undefined =>
  getProjectTestName(test)?.replace(/\s+/g, "").toLowerCase();

const createPassRatioByTestName = (
  summaries: ProjectTestSummaryListItem[]
): Map<string, string> => {
  const passRatioByTestName = new Map<string, string>();

  summaries.forEach((summary) => {
    const testName = getNormalizedProjectTestName(summary);
    const passRatio = toOptionalText(summary.passRatio);
    if (!testName || !passRatio || passRatioByTestName.has(testName)) return;
    passRatioByTestName.set(testName, passRatio);
  });

  return passRatioByTestName;
};

const getProjectTestGroupKey = (test: TestDashboardBasicListItem, index: number): string =>
  getProjectTestName(test) ??
  toOptionalText(test.testCaseId) ??
  `test-${index + 1}`;

const getUniqueProjectTestGroups = (
  tests: TestDashboardBasicListItem[]
): TestDashboardBasicListItem[] => {
  const seen = new Set<string>();

  return tests.filter((test, index) => {
    const key = getProjectTestGroupKey(test, index);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const mapProjectTest = (
  projectId: number,
  test: TestDashboardBasicListItem,
  index: number,
  fallbackPassRatio?: string
): TestCodeItem => {
  const id = toOptionalText(test.testCaseId) ?? toOptionalText(test.id);
  const title = getProjectTestName(test) ?? '';
  const key = id ?? `${index}`;
  const groupId = toOptionalIdText(test.groupId ?? test.testGroupId ?? test.executionId);

  return {
    id: key,
    codeId: id ? formatCodeId(id) : '',
    title,
    status: "Untest",
    projectId: String(projectId),
    groupId,
    executionId: toOptionalIdText(test.executionId) ?? groupId,
    passRatio: toOptionalText(test.passRatio) ?? fallbackPassRatio,
    duration: toOptionalText(test.duration) ?? toOptionalText(test.testDuration),
    user: toOptionalText(test.tester) ?? toOptionalText(test.testerName),
    date: formatCompletedAt(test.completedAt ?? test.executedAt ?? test.createdAt),
  };
};

const formatTestedText = (countString: string | undefined, passCount: number, totalCount: number) => {
  const text = countString?.trim();
  if (!text) return `${passCount} / ${totalCount} Tested`;
  return text.toLowerCase().includes("tested") ? text : `${text} Tested`;
};

const createSummary = (
  passCount = 0,
  totalCount = 0,
  countString?: string,
  passRatio?: string
): ProjectSummary => ({
  passRateText: `${passRatio ?? "0%"} Pass`,
  testedText: formatTestedText(countString, passCount, totalCount),
  counts: {
    pass: passCount,
    block: 0,
    fail: 0,
    untest: Math.max(totalCount - passCount, 0),
  },
});

const resolveCurrentMembership = (
  projectId: number,
  members: ProjectMemberResponse[],
  currentUser: CurrentUserIdentity
): { myUserId: string; myRole: ProjectRolePreview } => {
  const directUserId = getCurrentUserId(currentUser);
  const normalizedNameCandidates = [currentUser.username, currentUser.githubId]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim().toLowerCase());
  const normalizedEmail = currentUser.email?.trim().toLowerCase();

  let me: ProjectMemberResponse | undefined;
  if (directUserId !== undefined) {
    me = members.find((member) => member.userId === directUserId);
  }

  if (!me && normalizedNameCandidates.length > 0) {
    me = members.find((member) =>
      normalizedNameCandidates.includes(member.username.trim().toLowerCase())
    );
  }

  if (!me && normalizedEmail) {
    me = members.find((member) => member.email?.trim().toLowerCase() === normalizedEmail);
  }

  if (!me) {
    console.warn(
      `[ProjectManagement] 프로젝트(${projectId})에서 현재 유저 매칭 실패 - member로 처리합니다.`,
      { currentUser, members }
    );
    return {
      myUserId: directUserId !== undefined ? String(directUserId) : "",
      myRole: "member",
    };
  }

  return {
    myUserId: String(me.userId),
    myRole: normalizeMemberRole(me.role) === "OWNER" ? "owner" : "member",
  };
};

const buildDefaultDetail = (
  id: string,
  name: string,
  members: Member[],
  myUserId: string,
  myRole: ProjectRolePreview,
  tests: TestCodeItem[],
  summary: ProjectSummary = createSummary()
): ProjectDetail => ({
  id,
  name,
  summary,
  avgTestTime: [] as AvgTestTimePoint[],
  tests,
  members,
  myUserId,
  myRole,
});

const resolveProjectMetadata = async (
  project: ProjectApiItem,
  currentUser: CurrentUserIdentity
): Promise<ProjectListMetadata> => {
  const directUserId = getCurrentUserId(currentUser);

  let members: ProjectMemberResponse[] = [];
  try {
    members = await fetchProjectMembers(project.id);
  } catch (error) {
    console.error(`[ProjectManagement] 프로젝트(${project.id}) 멤버 조회 실패:`, error);
  }

  let languages: string[] = [];
  try {
    const repos = await fetchProjectRepos(project.id);
    languages = sanitizeLanguageTags(extractLanguagesFromRepos(repos));
  } catch (error) {
    console.error(`[ProjectManagement] 프로젝트(${project.id}) 레포 조회 실패:`, error);
  }

  let tests: TestCodeItem[] = [];
  let summary = createSummary();
  try {
    const [testResponses, summaryResponses, stats] = await Promise.all([
      fetchTestDashboardBasicList(project.id),
      fetchProjectTestSummaryList(project.id),
      fetchProjectGlobalTestStats(project.id),
    ]);
    const passRatioByTestName = createPassRatioByTestName(summaryResponses);
    tests = getUniqueProjectTestGroups(testResponses).map((test, index) => {
      const testName = getNormalizedProjectTestName(test);
      return mapProjectTest(
        project.id,
        test,
        index,
        testName ? passRatioByTestName.get(testName) : undefined
      );
    });
    summary = createSummary(stats.passCount, stats.totalCount, stats.countString, stats.passRatio);
  } catch (error) {
    console.error(`[ProjectManagement] 프로젝트(${project.id}) 테스트 목록 조회 실패:`, error);
  }

  const mappedMembers = mapProjectMembers(members);
  const ownerFromMembers =
    members.find((member) => normalizeMemberRole(member.role) === "OWNER") ?? members[0];

  let myMembership: { myUserId: string; myRole: ProjectRolePreview } = {
    myUserId: directUserId !== undefined ? String(directUserId) : "",
    myRole: "member",
  };

  if (members.length > 0) {
    myMembership = resolveCurrentMembership(project.id, members, currentUser);
  }

  return {
    languages,
    hostUsername: ownerFromMembers?.username ?? "OWNER",
    hostProfileImageUrl: ownerFromMembers?.profileImageUrl ?? "",
    members: mappedMembers,
    myUserId: myMembership.myUserId,
    myRole: myMembership.myRole,
    tests,
    summary,
  };
};

export default function useProjectManagementModel() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [detailsById, setDetailsById] = useState<Record<string, ProjectDetail>>({});

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const [projectResponses, myInfo] = await Promise.all([fetchProjects(), fetchUserMe()]);
        const currentUser: CurrentUserIdentity = myInfo;
        const currentUserId = getCurrentUserId(currentUser);
        if (cancelled) return;

        const metadataEntries = await Promise.all(
          projectResponses.map(async (project) => {
            const metadata = await resolveProjectMetadata(project, currentUser);
            return [project.id, metadata] as const;
          })
        );
        if (cancelled) return;

        const metadataByProjectId = new Map<number, ProjectListMetadata>(metadataEntries);

        const mappedProjects = projectResponses.map((project) =>
          toProjectListItem(
            project,
            metadataByProjectId.get(project.id) ?? {
              languages: [],
              hostUsername: "OWNER",
              hostProfileImageUrl: "",
              members: [],
              myUserId: currentUserId !== undefined ? String(currentUserId) : "",
              myRole: "member",
              tests: [],
              summary: createSummary(),
            }
          )
        );
        setProjects(mappedProjects);

        setDetailsById((prev) => {
          const next: Record<string, ProjectDetail> = {};
          mappedProjects.forEach((project) => {
            const metadata = metadataByProjectId.get(Number(project.id));
            next[project.id] = prev[project.id]
              ? {
                  ...prev[project.id],
                  name: project.name,
                  members: metadata?.members ?? [],
                  myUserId: metadata?.myUserId ?? "",
                  myRole: metadata?.myRole ?? "member",
                  tests: metadata?.tests ?? prev[project.id].tests,
                  summary: metadata?.summary ?? prev[project.id].summary,
                }
              : buildDefaultDetail(
                  project.id,
                  project.name,
                  metadata?.members ?? [],
                  metadata?.myUserId ?? "",
                  metadata?.myRole ?? "member",
                  metadata?.tests ?? [],
                  metadata?.summary ?? createSummary()
                );
          });
          return next;
        });
      } catch (error) {
        console.error("[ProjectManagement] 프로젝트 목록 조회 실패:", error);
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const getProject = (projectId: string) => projects.find((p) => p.id === projectId) ?? null;

  const getDetail = (projectId: string) => detailsById[projectId] ?? null;

  const leaveOrDeleteProject = async (projectId: string) => {
    const detail = detailsById[projectId];
    if (!detail) return;

    const numericProjectId = Number(projectId);
    if (!Number.isFinite(numericProjectId)) {
      throw new Error(`유효하지 않은 프로젝트 ID입니다: ${projectId}`);
    }

    if (detail.myRole === "owner") {
      await deleteProject(numericProjectId);
    } else {
      const numericUserId = Number(detail.myUserId);
      if (!Number.isFinite(numericUserId)) {
        throw new Error(`유효하지 않은 유저 ID입니다: ${detail.myUserId}`);
      }
      await leaveProjectAsMember(numericProjectId, numericUserId);
    }
  };

  const removeProjectLocally = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
    setDetailsById((prev) => {
      const next = { ...prev };
      delete next[projectId];
      return next;
    });
  };

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

  const allGithubCandidates: Member[] = [];

  return {
    projects,
    getProject,
    getDetail,
    leaveOrDeleteProject,
    removeProjectLocally,
    saveSettings,
    allGithubCandidates,
  };
}
