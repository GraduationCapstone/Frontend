import { useEffect, useState } from "react";
import InputField from "../../../components/common/InputField";
import { Button } from "../../../components/common/Button";
import CloseIcon from "../../../assets/icons/dismiss.svg?react";

type Props = {
  open: boolean;
  title: string;

  onClose: () => void;
  onConfirm: (nextTitle?: string) => void;
};

export default function EditTestCodeModal(props: Props) {
  const { open, title, onClose, onConfirm } = props;

  const [draft, setDraft] = useState(title);

  useEffect(() => {
    if (open) setDraft(title);
  }, [open, title]);

  if (!open) return null;

  const handleSave = () => {
    onConfirm(draft.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.3)] flex items-center justify-center"
    >
      <div
        className="w-overlay-modal h-72 p-5 bg-grayscale-white rounded-2xl shadow-ds-400 inline-flex flex-col justify-between items-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="text-h2-ko text-grayscale-black">
            테스트 코드 수정
          </div>

          <Button
          variant="staticClearXsIcon"
          children={undefined}
          Icon={CloseIcon}
          ariaLabel="close"
          onClick={onClose}
          />
        </div>

        <div className="self-stretch">
          <InputField
            value={draft}
            placeholder="test_code"
            disabled={false}
            showIcon={false}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        <Button
          variant="staticGy900MText"
          label="저장"
          children={undefined}
          onClick={handleSave}
          className="w-s py-2 bg-grayscale-gy900 rounded-xl shadow-ds-200 inline-flex justify-center items-center gap-2.5"
        />
      </div>
    </div>
  );
}
