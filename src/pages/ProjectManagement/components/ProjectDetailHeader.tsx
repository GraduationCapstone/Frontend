import { Button } from "../../../components/common";
import setting from "../../../assets/icons/setting.svg?react";

type Props = {
  projectName: string;
  onOpenSettings?: () => void;
  showSettingsButton?: boolean;
};

export default function ProjectDetailHeader({
  projectName,
  onOpenSettings,
  showSettingsButton = true,
}: Props) {
  return (
    <div className="self-stretch inline-flex justify-between items-center">
      <div className="text-grayscale-black justify-center text-h3-ko">{projectName}</div>
      {showSettingsButton && (
        <Button
          variant="dynamicWhiteMDsIconText"
          label="프로젝트 설정"
          onClick={onOpenSettings}
          children={undefined}
          Icon={setting}
          iconPosition="left"
        />
      )}
    </div>
  );
}