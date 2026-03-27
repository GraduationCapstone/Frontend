import { Button } from "../../../components/common";
import ProjectCard from "./ProjectCard";
import type { ProjectListItem } from "../types";

type Props = {
  title: string;
  projects: ProjectListItem[];
  onOpenProject: (projectId: string) => void;
  onCreateProject?: () => void;
};

export default function ProjectListSection({
  title,
  projects,
  onOpenProject,
  onCreateProject,
}: Props) {
  const isEmpty = projects.length === 0;

  return (
    <>
      <div className="w-xl justify-center text-grayscale-black text-h2-ko">{title}</div>

      {isEmpty ? (
        <div className="w-xl px-5 pt-24 pb-14 rounded-2xl inline-flex flex-col justify-start items-center gap-14 shadow-is-100 bg-grayscale-white">
          <div className="inline-flex flex-col justify-start items-center gap-3">
            <div className="text-medium500-ko text-grayscale-black">참여 중인 프로젝트가 없습니다.</div>
            <div className="text-medium500-ko text-grayscale-gy700 text-center">
            Probe와 함께 테스트 자동화의 세상을 만들어봐요.</div>
            {/* // 새프로젝트 누르면 어디로 가야 되지.... */}
            <Button
            variant="staticGy900MText"
            label="새 프로젝트"
            children={undefined}
            onClick={onCreateProject}
          />
          </div>
        </div>
      ) : (
        <div className="inline-flex flex-col justify-start items-start gap-8">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              code={p.code}
              name={p.name}
              hostUsername={p.hostUsername}
              hostProfileImageUrl={p.hostProfileImageUrl}
              tags={p.tags}
              updatedText={p.updatedText}
              onClick={() => onOpenProject(p.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
