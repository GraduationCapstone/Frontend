import { useEffect, useState } from "react";
import type { ProjectDetail, ProjectListItem, Member, AvgTestTimePoint } from "./types";
import type { ProjectRepoResponse, ProjectResponse } from "../../api/project";
import { fetchProjectRepos, fetchProjects } from "../../api/project";

type ProjectApiItem = ProjectResponse;

const toProjectListItem = (
  project: ProjectApiItem,
  languages: string[]
): ProjectListItem => ({
  id: String(project.id),
  code: `P${project.id}`,
  name: project.projectName,
  tags: languages,
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

const extractProjectLanguages = (project: ProjectApiItem): string[] => {
  const candidates: string[] = [];
  if (project.language) candidates.push(project.language);
  if (project.languages?.length) candidates.push(...project.languages);
  return sanitizeLanguageTags(Array.from(new Set(candidates)));
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

const resolveProjectLanguages = async (project: ProjectApiItem): Promise<string[]> => {
  const fromProject = extractProjectLanguages(project);
  if (fromProject.length > 0) return fromProject;

  try {
    const repos = await fetchProjectRepos(project.id);
    return sanitizeLanguageTags(extractLanguagesFromRepos(repos));
  } catch (error) {
    console.error(
      `[ProjectManagement] 프로젝트(${project.id}) 레포 조회 실패:`,
      error
    );
    return [];
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

        const languageEntries = await Promise.all(
          projectResponses.map(async (project) => {
            const languages = await resolveProjectLanguages(project);
            return [project.id, languages] as const;
          })
        );
        if (cancelled) return;

        const languagesByProjectId = new Map<number, string[]>(languageEntries);

        const mappedProjects = projectResponses.map((project) =>
          toProjectListItem(
            project,
            languagesByProjectId.get(project.id) ?? []
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
