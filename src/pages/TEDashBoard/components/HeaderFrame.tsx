import { Button } from '../../../components/common';
import InputField from '../../../components/common/InputField';

import pencil from '../../../assets/icons/pencil.svg?react';
import download from '../../../assets/icons/download.svg?react';

type Props = {
  title: string;
  isEditingTitle: boolean;
  draftTitle: string;
  setDraftTitle: (v: string) => void;
  onStartEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelTitle: () => void;
  onDownloadTestPlan: () => void;
  onDownloadTestReport: () => void;
};

export default function HeaderFrame({
  title,
  isEditingTitle,
  draftTitle,
  setDraftTitle,
  onStartEditTitle,
  onSaveTitle,
  onDownloadTestPlan,
  onDownloadTestReport,
}: Props) {
  return (
    <section className="inline-flex w-full items-center justify-between self-stretch">
      {!isEditingTitle ? (
        <div className="inline-flex items-center justify-start gap-4 py-2 pl-2">
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
        <div className="max-w-m flex w-full items-center gap-3">
          <div className="min-w-0 flex-1">
            <InputField value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
          </div>

          <Button
            variant="dynamicSg500SText"
            children="저장"
            className="inline-flex shrink-0 items-center justify-center gap-2.5 px-4 py-2 whitespace-nowrap"
            onClick={onSaveTitle}
          />
        </div>
      )}

      <div className="gap-gap-s inline-flex items-start justify-start">
        <Button
          variant="dynamicGy900MIconText"
          Icon={download}
          iconPosition="left"
          children="테스트 계획서"
          className="w-xs py-2 pr-4 pl-3"
          onClick={onDownloadTestPlan}
        />
        <Button
          variant="dynamicGy900MIconText"
          Icon={download}
          iconPosition="left"
          children="테스트 결과 보고서"
          className="w-xs py-2 pr-4 pl-3"
          onClick={onDownloadTestReport}
        />
      </div>
    </section>
  );
}
