import { Button } from "../../../components/common";
import InputField from "../../../components/common/InputField";

import pencil from "../../../assets/icons/pencil.svg?react";
import download from "../../../assets/icons/download.svg?react";

type Props = {
  title: string;
  isEditingTitle: boolean;
  draftTitle: string;
  setDraftTitle: (v: string) => void;
  onStartEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelTitle: () => void;
};

export default function HeaderFrame({
  title,
  isEditingTitle,
  draftTitle,
  setDraftTitle,
  onStartEditTitle,
  onSaveTitle,
}: Props) {

  return (
    <section className="self-stretch w-full inline-flex items-center justify-between">
        {!isEditingTitle ? (
          <div className="pl-2 py-2 inline-flex justify-start items-center gap-4">
            <h1 className="text-h3-ko text-grayscale-black max-w-s">{title}</h1>
            <Button
              variant="staticClearXsIcon"
              children={undefined}
              Icon={pencil}
              ariaLabel="pencil"
              onClick={onStartEditTitle}
            />
          </div>
        ) : (
          <div className="max-w-m w-full flex items-center gap-3">
            <div className="flex-1 min-w-0">
                <InputField
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}/>
            </div>

            <Button
              variant="dynamicSg500SText"
              children="저장"
              className="shrink-0 whitespace-nowrap px-4 py-2 inline-flex justify-center items-center gap-2.5"
              onClick={onSaveTitle}
              />
          </div>
        )}

      <div className="inline-flex justify-start items-start gap-gap-s">
        <Button
          variant="dynamicGy900MIconText"
          Icon={download}
          iconPosition="left"
          children="테스트 계획서"
          className="w-xs pl-3 pr-4 py-2"
        //   onClick={() => {}}
        />
        <Button
          variant="dynamicGy900MIconText"
          Icon={download}
          iconPosition="left"
          children="테스트 결과 보고서"
          className="w-xs pl-3 pr-4 py-2"
        //   onClick={() => {}} 추후 연결
        />
      </div>
    </section>
  );
}
