import type { Member, ProjectDetail, ProjectListItem, ProjectManagementMode } from "./types";

import ProjectListSection from "./components/ProjectListSection";
import ProjectDetailHeader from "./components/ProjectDetailHeader";
import AvgTestTimeChart from "./components/AvgTestTimeChart";
import ProjectTestsPanel from "./components/ProjectTestsPanel";
import ProjectSettingsForm from "./components/ProjectSettingsForm";
import ProjectSummarySection from "./components/ProjectSummarySection";

type Props = {
  mode: ProjectManagementMode;
  projects?: ProjectListItem[];
  detail?: ProjectDetail;

  onOpenProject?: (projectId: string) => void;
  onOpenSettings?: () => void;
  onBackToList?: () => void;
  onCancelSettings?: () => void;
  onSaveSettings?: (nextName: string, nextMembers: Member[]) => void;
  allGithubCandidates?: Member[];
};

const containerClassByMode: Record<ProjectManagementMode, string> = {
  list: "self-stretch min-h-[1008px] desktop:min-h-[1440px] wide:min-h-[1008px] pt-60 inline-flex flex-col justify-start items-center gap-14",
  detail:
    "self-stretch min-h-[1008px] desktop:min-h-[1440px] wide:min-h-[1008px] px-layout-margin pt-26 pb-24 inline-flex flex-col justify-start items-center gap-10",
  settings:
    "self-stretch min-h-[1008px] desktop:min-h-[1440px] wide:min-h-[1008px] px-layout-margin py-24 inline-flex flex-col justify-start items-center gap-20",
};

export default function ProjectManagementView(props: Props) {
  const {
    mode,
    projects,
    detail,
    onOpenProject,
    onOpenSettings,
    onCancelSettings,
    onSaveSettings,
    allGithubCandidates,
  } = props;

  const containerClassName = containerClassByMode[mode];

  return (
    <div className={containerClassName}>
      {mode === "list" && (
        <ProjectListSection
          title="나의 프로젝트"
          projects={projects ?? []}
          onOpenProject={(id) => onOpenProject?.(id)}
        />
      )}
      
      {/* 프로젝트 디테일 */}
      {mode === "detail" && detail && (
        <>
            <ProjectDetailHeader
              projectName={detail.name}
              onOpenSettings={() => onOpenSettings?.()}
            />

          <div className="self-stretch inline-flex justify-center items-center gap-14 flex-wrap content-center">
            <ProjectSummarySection summary={detail.summary} />
            <AvgTestTimeChart data={detail.avgTestTime} title="평균 테스트 시간" />
          </div>

          <ProjectTestsPanel title={`${detail.tests.length} 테스트`} tests={detail.tests} />
        </>
      )}
      
      {/* 프로젝트 설정 */}
      {mode === "settings" && detail && (
        <>
          <ProjectSettingsForm
            initialName={detail.name}
            initialMembers={detail.members}
            allCandidates={allGithubCandidates ?? []}
            onCancel={() => onCancelSettings?.()}
            onSave={(nextName, nextMembers) => onSaveSettings?.(nextName, nextMembers)}
          />
        </>
      )}
    </div>
  );
}
