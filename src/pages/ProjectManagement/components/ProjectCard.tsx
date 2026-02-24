import ProjectListItem from "../../../components/common/ListItem/ProjectListItem";

type Props = {
  code: string;
  name: string;
  languages?: Language;
  tags?: string[];

  updatedText: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
};

export default function ProjectCard({
  code,
  name,
  languages,
  tags,
  updatedText,
  onClick,
  disabled = false,
  selected,
  onSelectChange,
}: Props) {
  const resolvedLanguages: Language | undefined =
    languages ?? (tags?.length ? tags.map((t) => ({ name: t })) : undefined);
  return (
    <ProjectListItem
      className="w-xl self-stretch inline-flex justify-start items-center gap-5"
      code={code}
      title={name}
      languages={resolvedLanguages}
      updatedAt={updatedText}
      disabled={disabled}
      selected={selected}
      onSelectChange={onSelectChange}
      onClick={() => onClick()}
      
    />
  );
}

