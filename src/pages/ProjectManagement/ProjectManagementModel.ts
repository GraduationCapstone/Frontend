import { useEffect, useState } from "react";
import type { ProjectDetail, ProjectListItem, Member, AvgTestTimePoint } from "./types";
import type {
  ProjectMemberResponse,
  ProjectRepoResponse,
  ProjectResponse,
} from "../../api/project";
import { fetchProjectMembers, fetchProjectRepos, fetchProjects } from "../../api/project";

type ProjectApiItem = ProjectResponse;
type ProjectListMetadata = {
  languages: string[];
  hostUsername: string;
  hostProfileImageUrl: string;
};

const toProjectListItem = (
  project: ProjectApiItem,
  metadata: ProjectListMetadata
): ProjectListItem => ({
  id: String(project.id),
  code: `P${project.id}`,
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

const extractOwner = (
  projectId: number,
  members: ProjectMemberResponse[]
): ProjectMemberResponse => {
  const owner = members.find((member) => member.role === "OWNER");
  if (!owner) {
    throw new Error(`[ProjectManagement] 프로젝트(${projectId}) OWNER가 없습니다.`);
  }
  return owner;
};

const buildDefaultDetail = (id: string, name: string): ProjectDetail => ({
  id,
  name,
  summary: {
    passRateText: "0% Pass",
    testedText: "0 / 0 Tested",
    counts: { pass: 0, block: 0, fail: 0, untest: 0 },
  },
  avgTestTime: [] as AvgTestTimePoint[],
  tests: [],
  members: [],
});

const resolveProjectMetadata = async (
  project: ProjectApiItem
): Promise<ProjectListMetadata> => {
  try {
    const [repos, members] = await Promise.all([
      fetchProjectRepos(project.id),
      fetchProjectMembers(project.id),
    ]);
    const owner = extractOwner(project.id, members);

    return {
      languages: sanitizeLanguageTags(extractLanguagesFromRepos(repos)),
      hostUsername: owner.username,
      hostProfileImageUrl: owner.profileImageUrl,
    };
  } catch (error) {
    console.error(
      `[ProjectManagement] 프로젝트(${project.id}) 메타데이터 조회 실패:`,
      error
    );
    return {
      languages: [],
      hostUsername: "OWNER",
      hostProfileImageUrl: "",
    };
  }
};

export default function useProjectManagementModel() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [detailsById, setDetailsById] = useState<Record<string, ProjectDetail>>({});

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const projectResponses = await fetchProjects();
        if (cancelled) return;

        const metadataEntries = await Promise.all(
          projectResponses.map(async (project) => {
            const metadata = await resolveProjectMetadata(project);
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
            }
          )
        );
        setProjects(mappedProjects);

        setDetailsById((prev) => {
          const next: Record<string, ProjectDetail> = {};
          mappedProjects.forEach((project) => {
            next[project.id] = prev[project.id]
              ? { ...prev[project.id], name: project.name }
              : buildDefaultDetail(project.id, project.name);
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
    saveSettings,
    allGithubCandidates,
  };
}
