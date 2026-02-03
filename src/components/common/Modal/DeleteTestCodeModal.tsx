import { Button } from "../../../components/common/Button";
import CloseIcon from "../../../assets/icons/dismiss.svg?react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteTestCodeModal(props: Props) {
  const { open, onClose, onConfirm } = props;
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.3)] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-overlay-modal h-72 p-5 bg-grayscale-white rounded-2xl shadow-ds-400 inline-flex flex-col justify-between items-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="text-grayscale-black text-h2-ko">
            테스트 코드 삭제
          </div>

          <Button
            variant="staticClearXsIcon"
            children={undefined}
            Icon={CloseIcon}
            ariaLabel="close"
            onClick={onClose}
          />
        </div>

        <div className="inline-flex flex-col justify-start items-center gap-4">
          <div className="text-grayscale-black text-h3-ko">
            선택한 테스트 코드를 삭제하시겠습니까?
          </div>
          <div className="text-grayscale-black text-h3-ko">
            이 작업은 복구할 수 없습니다.
          </div>
        </div>
        <Button
          variant="staticGy900MText"
          label="확인"
          children={undefined}
          onClick={handleConfirm}
          className="w-s py-2 bg-grayscale-gy900 rounded-xl shadow-ds-200 inline-flex justify-center items-center gap-2.5"
        />
      </div>
    </div>
  );
}
