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
  inviteMembers,
  leaveProjectAsMember,
  updateProjectName,
} from "../../api/project";
import type {
  ProjectDailyAvgTestStatsItem,
  TestDashboardBasicListItem,
} from "../../api/testDashboard";
import {
  deleteTestDashboardGroup,
  fetchProjectDailyAvgTestStats,
  fetchProjectGlobalTestStats,
  fetchTestDashboardBasicList,
  updateTestDashboardCodeName,
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
  avgTestTime: AvgTestTimePoint[];
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

const toNumericIdText = (value: string | number | null | undefined): string | undefined => {
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : undefined;

  const text = toOptionalText(value);
  return text && /^\d+$/.test(text) ? text : undefined;
};

const formatCompletedAt = (completedAt: string | null | undefined): string | undefined => {
  const text = toOptionalText(completedAt);
  return text?.replace("T", " ").slice(0, 16);
};

const normalizeStatus = (status: string | null | undefined): TestCodeItem["status"] => {
  const normalized = status?.replace(/[\s_-]/g, "").toUpperCase() ?? "";

  if (
    normalized === "PASS" ||
    normalized === "PASSED" ||
    normalized === "SUCCESS" ||
    normalized === "COMPLETED"
  ) {
    return "Pass";
  }
  if (normalized === "FAIL" || normalized === "FAILED" || normalized === "ERROR") {
    return "Fail";
  }
  if (normalized === "BLOCK" || normalized === "BLOCKED") {
    return "Block";
  }

  return "Untest";
};

const formatCodeId = (id: string): string => {
  const parts = id.split("_");
  if (parts.length !== 3 || parts[0] !== parts[1]) return id;
  return `${parts[0]}_${parts[2]}`;
};

const SCENARIO_GUIDE_NAMES: Record<string, string> = {
  "01": "회원가입",
  "02": "로그인",
  "03": "비밀번호 찾기/재설정",
  "04": "로그아웃",
  "05": "프로필 수정",
  "06": "비밀번호 변경",
  "07": "권한 기반 접근 제어",
  "08": "세션 만료/토큰 만료",
  "09": "게시글 작성",
  "10": "게시글 수정/삭제",
  "11": "댓글 작성/수정/삭제",
  "12": "좋아요/즐겨찾기",
  "13": "검색",
  "14": "필터/정렬",
  "15": "반응형 레이아웃",
  "16": "브라우저 호환성",
  "17": "에러 페이지 동작",
  "18": "네트워크 끊김 상태",
  "19": "서버 응답 지연",
  "20": "API 에러 응답 처리",
  "21": "A/B 테스트 요소 확인",
  "22": "입력값 유효성 검사",
  "23": "다국어 지원 시 언어 변경 테스트",
  "24": "파일 업로드/다운로드",
  "25": "푸시 알림",
  "26": "다중 사용자 동시 접속",
};

const getScenarioSerial = (testCaseId: string | number | null | undefined): string | undefined => {
  const text = String(testCaseId ?? "").trim();
  return /^T(\d{2})/.exec(text)?.[1];
};

const getScenarioGuideName = (test: TestDashboardBasicListItem): string | undefined => {
  const serial = getScenarioSerial(test.testCaseId);
  return serial ? SCENARIO_GUIDE_NAMES[serial] : undefined;
};

type ProjectTestNameSource = Pick<
  TestDashboardBasicListItem,
  "CaseName" | "testCaseName" | "testCodeName" | "testGroupName"
>;

const getProjectTestName = (test: ProjectTestNameSource): string | undefined =>
  toOptionalText(test.CaseName) ??
  toOptionalText(test.testGroupName) ??
  toOptionalText(test.testCodeName) ??
  toOptionalText(test.testCaseName);

const getProjectTestGroupKey = (test: TestDashboardBasicListItem, index: number): string => {
  const groupId = toOptionalIdText(test.groupId ?? test.testGroupId);
  const scenarioSerial = getScenarioSerial(test.testCaseId);

  return (
    toOptionalIdText(test.executionId) ??
    (groupId && scenarioSerial ? `${groupId}:${scenarioSerial}` : undefined) ??
    groupId ??
    getProjectTestName(test) ??
    toOptionalText(test.testCaseId) ??
    `test-${index + 1}`
  );
};

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

const getScenarioSuffixKey = (test: TestDashboardBasicListItem): string | undefined => {
  const title = getProjectTestName(test);
  if (!title) return undefined;

  const groupKey = toOptionalIdText(test.groupId ?? test.testGroupId) ?? title;
  return `${groupKey}:${title}`;
};

const getScenarioSuffixKeys = (tests: TestDashboardBasicListItem[]): Set<string> => {
  const scenarioNamesByTitle = new Map<string, Set<string>>();

  tests.forEach((test) => {
    const key = getScenarioSuffixKey(test);
    const scenarioGuideName = getScenarioGuideName(test);
    if (!key || !scenarioGuideName) return;

    const names = scenarioNamesByTitle.get(key) ?? new Set<string>();
    names.add(scenarioGuideName);
    scenarioNamesByTitle.set(key, names);
  });

  return new Set(
    Array.from(scenarioNamesByTitle.entries())
      .filter(([, names]) => names.size > 1)
      .map(([key]) => key)
  );
};

const buildProjectTestTitle = (
  test: TestDashboardBasicListItem,
  shouldAppendScenarioGuideName: boolean
): string => {
  const title = getProjectTestName(test) ?? "";
  const scenarioGuideName = getScenarioGuideName(test);
  if (!shouldAppendScenarioGuideName || !title || !scenarioGuideName) return title;
  if (title.endsWith(`(${scenarioGuideName})`)) return title;

  return `${title} (${scenarioGuideName})`;
};

const mapProjectTest = (
  projectId: number,
  test: TestDashboardBasicListItem,
  index: number,
  titleOverride?: string
): TestCodeItem => {
  const id = toOptionalText(test.testCaseId) ?? toOptionalText(test.id);
  const title = titleOverride ?? getProjectTestName(test) ?? '';
  const key = id ?? `${index}`;
  const groupId = toNumericIdText(test.groupId ?? test.testGroupId);

  return {
    id: key,
    codeId: id ? formatCodeId(id) : '',
    title,
    status: normalizeStatus(test.status),
    resultId: toNumericIdText(test.resultId ?? test.testResultId ?? test.id),
    projectId: String(projectId),
    groupId,
    executionId: toOptionalIdText(test.executionId),
    passRatio: toOptionalText(test.passRatio),
    duration: toOptionalText(test.duration) ?? toOptionalText(test.testDuration),
    user: toOptionalText(test.tester) ?? toOptionalText(test.testerName),
    testerProfileImage: toOptionalText(test.testerProfileImage),
    date: formatCompletedAt(test.completedAt ?? test.executedAt ?? test.createdAt),
  };
};

const mapProjectTests = (
  projectId: number,
  tests: TestDashboardBasicListItem[]
): TestCodeItem[] => {
  const uniqueTests = getUniqueProjectTestGroups(tests);
  const scenarioSuffixKeys = getScenarioSuffixKeys(uniqueTests);

  return uniqueTests.map((test, index) =>
    mapProjectTest(
      projectId,
      test,
      index,
      buildProjectTestTitle(test, scenarioSuffixKeys.has(getScenarioSuffixKey(test) ?? ""))
    )
  );
};

const formatTestedText = (
  countString: string | undefined,
  passCount: number,
  testTotalCount: number
) => {
  const text = countString?.trim();
  if (!text) return `${passCount} / ${testTotalCount} Tested`;
  return text.toLowerCase().includes("tested") ? text : `${text} Tested`;
};

const createSummary = (
  passCount = 0,
  testTotalCount = 0,
  countString?: string,
  passRatio?: string
): ProjectSummary => ({
  passRateText: `${passRatio ?? "0%"} Pass`,
  testedText: formatTestedText(countString, passCount, testTotalCount),
  counts: {
    pass: passCount,
    block: 0,
    fail: Math.max(testTotalCount - passCount, 0),
    untest: 0,
  },
});

const parseDurationToSeconds = (duration: string | null | undefined): number | null => {
  const text = duration?.trim();
  if (!text) return null;

  const colonParts = text.split(":").map((part) => Number(part));
  if (colonParts.length === 3 && colonParts.every((value) => Number.isFinite(value))) {
    const [hours, minutes, seconds] = colonParts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (colonParts.length === 2 && colonParts.every((value) => Number.isFinite(value))) {
    const [minutes, seconds] = colonParts;
    return minutes * 60 + seconds;
  }

  const normalized = text.toLowerCase().replace(/\s+/g, "");
  const minuteMatch = normalized.match(/(\d+)m/);
  const secondMatch = normalized.match(/(\d+)s/);
  if (minuteMatch || secondMatch) {
    const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
    const seconds = secondMatch ? Number(secondMatch[1]) : 0;
    return minutes * 60 + seconds;
  }

  const asNumber = Number(normalized);
  return Number.isFinite(asNumber) ? asNumber : null;
};

const toDateTime = (date: string): number => {
  const time = Date.parse(date);
  return Number.isFinite(time) ? time : 0;
};

const mapDailyAvgTestTime = (stats: ProjectDailyAvgTestStatsItem[]): AvgTestTimePoint[] =>
  stats
    .map((item) => {
      const seconds = parseDurationToSeconds(item.averageDuration);
      if (seconds === null) return null;
      return {
        date: item.date,
        seconds,
      };
    })
    .filter((item): item is AvgTestTimePoint => item !== null)
    .sort((a, b) => toDateTime(a.date) - toDateTime(b.date))
    .slice(-6);

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
  avgTestTime: AvgTestTimePoint[],
  summary: ProjectSummary = createSummary()
): ProjectDetail => ({
  id,
  name,
  summary,
  avgTestTime,
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
  let avgTestTime: AvgTestTimePoint[] = [];
  try {
    const [testResponses, stats, dailyAvgStats] = await Promise.all([
      fetchTestDashboardBasicList(project.id),
      fetchProjectGlobalTestStats(project.id),
      fetchProjectDailyAvgTestStats(project.id),
    ]);
    tests = mapProjectTests(project.id, testResponses);
    const {
      passCount,
      totalCount: testTotalCount,
      countString,
      passRatio,
    } = stats;
    summary = createSummary(passCount, testTotalCount, countString, passRatio);
    avgTestTime = mapDailyAvgTestTime(dailyAvgStats);
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
    avgTestTime,
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
              avgTestTime: [],
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
                  avgTestTime: metadata?.avgTestTime ?? prev[project.id].avgTestTime,
                }
              : buildDefaultDetail(
                  project.id,
                  project.name,
                  metadata?.members ?? [],
                  metadata?.myUserId ?? "",
                  metadata?.myRole ?? "member",
                  metadata?.tests ?? [],
                  metadata?.avgTestTime ?? [],
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

  const saveSettings = async (projectId: string, nextName: string, nextMembers: Member[]) => {
    const detail = detailsById[projectId];
    const numericProjectId = Number(projectId);
    if (!Number.isFinite(numericProjectId)) {
      throw new Error(`유효하지 않은 프로젝트 ID입니다: ${projectId}`);
    }

    if (detail && detail.name !== nextName) {
      await updateProjectName(numericProjectId, { projectName: nextName });
    }

    const memberEmails = nextMembers
      .map((member) => member.email)
      .filter((email): email is string => Boolean(email?.trim()));

    if (memberEmails.length > 0) {
      await inviteMembers(numericProjectId, { emails: memberEmails });
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, name: nextName } : p))
    );

    setDetailsById((prev) => {
      const cur = prev[projectId];
      if (!cur) return prev;
      return { ...prev, [projectId]: { ...cur, name: nextName, members: nextMembers } };
    });
  };

  const renameTestGroup = async (projectId: string, testId: string, nextTitle: string) => {
    const detail = detailsById[projectId];
    const target = detail?.tests.find((test) => test.id === testId);
    const resultId = target?.resultId;

    if (!detail || !target || !resultId) {
      const message =
        "[ProjectManagement] 테스트명 수정에 필요한 숫자 resultId가 없습니다. /tests/list/basic 응답에 resultId를 내려줘야 합니다.";
      console.error(message, { projectId, testId, target });
      throw new Error(message);
    }

    await updateTestDashboardCodeName(projectId, resultId, nextTitle);
    setDetailsById((prev) => {
      const cur = prev[projectId];
      if (!cur) return prev;

      return {
        ...prev,
        [projectId]: {
          ...cur,
          tests: cur.tests.map((test) =>
            test.id === testId ? { ...test, title: nextTitle } : test
          ),
        },
      };
    });
  };

  const deleteTestGroup = async (projectId: string, testId: string) => {
    const detail = detailsById[projectId];
    const target = detail?.tests.find((test) => test.id === testId);
    const groupId = target?.groupId;

    if (!detail || !target || !groupId) {
      const message =
        "[ProjectManagement] 테스트 그룹 삭제에 필요한 숫자 groupId가 없습니다. /tests/list/basic 응답에 groupId를 내려줘야 합니다.";
      console.error(message, { projectId, testId, target });
      throw new Error(message);
    }

    await deleteTestDashboardGroup(projectId, groupId);
    setDetailsById((prev) => {
      const cur = prev[projectId];
      if (!cur) return prev;

      return {
        ...prev,
        [projectId]: {
          ...cur,
          tests: cur.tests.filter((test) => test.id !== testId),
        },
      };
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
    renameTestGroup,
    deleteTestGroup,
    allGithubCandidates,
  };
}
