import ProjectCard from "./ProjectCard";
import type { ProjectListItem } from "../types";

type Props = {
  title: string;
  projects: ProjectListItem[];
  onOpenProject: (projectId: string) => void;
};

export default function ProjectListSection({ title, projects, onOpenProject }: Props) {
  return (
      <><div className="w-xl justify-center text-grayscale-black text-h2-ko">
      {title}
    </div><div className="inline-flex flex-col justify-start items-start gap-8">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            code={p.code}
            name={p.name}
            tags={p.tags}
            updatedText={p.updatedText}
            onClick={() => onOpenProject(p.id)} />
        ))}
      </div></>
  );
}
