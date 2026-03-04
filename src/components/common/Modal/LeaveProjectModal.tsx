import { useEffect } from "react";

import { Button } from "../../../components/common";
import CloseIcon from "../../../assets/icons/dismiss.svg?react";

type Props = {
  open: boolean;
  step: "confirm" | "done";
  loading?: boolean;
  onClose: () => void;
  onLeave: () => void;
  onDone: () => void;
};

export default function LeaveProjectModal({
  open,
  step,
  loading = false,
  onClose,
  onLeave,
  onDone,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  if (!open) return null;

  const isConfirm = step === "confirm";

  return (
    <div
      className="fixed inset-0 z-[200] bg-[rgba(0,0,0,0.3)] flex items-center justify-center"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div className="w-overlay-modal h-72 p-5 bg-grayscale-white rounded-2xl shadow-ds-400 inline-flex flex-col justify-between items-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}>

        {/* 닫기 버튼 */}
        <div className="self-stretch inline-flex justify-end items-center gap-2.5">
            <Button
            variant="staticClearXsIcon"
            children={undefined}
            Icon={CloseIcon}
            ariaLabel="close"
            onClick={onClose}
            />
        </div>

        {/* 본문 */}
        <div className="inline-flex flex-col justify-start items-center gap-4">
          {isConfirm ? (
            <>
              <p className="justify-cente text-h3-ko text-grayscale-black text-center">
                이 프로젝트를 나가시겠습니까?
              </p>
              <p className="justify-cente text-h3-ko text-grayscale-black text-center">
                작업하신 테스트 데이터는 프로젝트에서 삭제되지 않습니다.
              </p>
            </>
          ) : (
            <>
              <p className="justify-center text-h3-ko text-grayscale-black text-center">
                프로젝트를 나갔습니다.
              </p>
              <p className="justify-center text-h3-ko text-grayscale-black text-center">
                ‘확인’을 누르시면 프로젝트 관리 페이지로 이동합니다.
              </p>
            </>
          )}
        </div>
        
        {isConfirm ? (
            <Button
              variant="staticGy900MText"
              children={undefined}
              label={loading ? "처리 중..." : "프로젝트 나가기"}
              disabled={loading}
              onClick={onLeave}
            />
          ) : (
            <Button
              variant="staticGy900MText"
              children={undefined}
              label="확인"
              onClick={onDone}
            />
          )}
      </div>
    </div>
  );
}
