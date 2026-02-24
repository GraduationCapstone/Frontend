import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { Member } from "../types";
import MemberSearch from "./MemberSearch";
import { Button } from "../../../components/common";
import InputField from "../../../components/common/InputField";
import LeaveProjectModal from "../../../components/common/Modal/LeaveProjectModal";

type Props = {
  initialName: string;
  initialMembers: Member[];
  allCandidates: Member[];
  onCancel: () => void;
  onSave: (nextName: string, nextMembers: Member[]) => void;
  onLeaveProject?: () => void | Promise<void>;
  onLeaveDone?: () => void;
};

export default function ProjectSettingsForm({
  initialName,
  initialMembers,
  allCandidates,
  onCancel,
  onSave,
  onLeaveProject,
  onLeaveDone,
}: Props) {
  const [name, setName] = useState(initialName);
  const [members, setMembers] = useState<Member[]>(initialMembers);

  // 나가기 모달
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveModalStep, setLeaveModalStep] = useState<"confirm" | "done">("confirm");
  const [isLeaving, setIsLeaving] = useState(false);

  const canSave = useMemo(() => {
    const nextName = name.trim();
    if (nextName.length === 0) return false;

    if (nextName !== initialName.trim()) return true;
    if (members.length !== initialMembers.length) return true;

    const a = [...members].map((m) => m.id).sort().join(",");
    const b = [...initialMembers].map((m) => m.id).sort().join(",");
    return a !== b;
  }, [name, members, initialName, initialMembers]);

  const openLeaveModal = () => {
    setLeaveModalStep("confirm");
    setIsLeaveModalOpen(true);
  };

  const closeLeaveModal = () => {
    if (isLeaving) return;
    setIsLeaveModalOpen(false);
    setLeaveModalStep("confirm");
  };

  const handleLeaveProject = async () => {
    try {
      setIsLeaving(true);

      if (onLeaveProject) {
        await onLeaveProject();
      }

      setLeaveModalStep("done");
    } catch (error) {
      console.error(error);
      setIsLeaveModalOpen(false);
      setLeaveModalStep("confirm");
    } finally {
      setIsLeaving(false);
    }
  };

  const handleLeaveDone = () => {
    setIsLeaveModalOpen(false);
    setLeaveModalStep("confirm");

    if (onLeaveDone) {
      onLeaveDone();
      return;
    }
    onCancel();
  };

  return (
    <>
      <div className="w-xl justify-center">
        <div className="text-h2-ko">프로젝트 설정</div>
      </div>

      <section className="w-xl px-3 inline-flex flex-col justify-start items-start gap-6">
        <div className="self-stretch inline-flex flex-col justify-start items-start gap-3">
          <div className="text-h3-ko text-grayscale-black">프로젝트명</div>
          <InputField
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Project name"
            showIcon={false}
          />
        </div>

        <div className="self-stretch inline-flex flex-col justify-start items-start gap-3">
          <div className="text-h3-ko text-grayscale-black">멤버 초대</div>
          <MemberSearch
            allCandidates={allCandidates}
            selected={members}
            onChangeSelected={setMembers}
          />
        </div>

        <div className="self-stretch inline-flex flex-col justify-center items-end gap-3">
          <div className="self-stretch justify-center text-h3-ko text-grayscale-black">
            멤버
          </div>

          {members.length === 0 ? (
            <div className="text-sm text-grayscale-gy500">초대된 멤버가 없습니다.</div>
          ) : (
            <ul className="w-full grid grid-cols-4 gap-x-10 gap-y-4">
              {members.map((m) => (
                <li key={m.id} className="inline-flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-sg550 text-grayscale-white flex items-center justify-center text-[14px]">
                    {m.username[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-h4-ko text-grayscale-black">
                    {m.username}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full inline-flex justify-end items-center gap-2.5">
          <Button
            variant="dynamicClearSTextUnderlined"
            children={undefined}
            label="프로젝트 나가기"
            onClick={openLeaveModal}
          />
        </div>
      </section>

      <div className="w-xl flex justify-center">
        <Button
          variant="staticGy900MText"
          children={undefined}
          label="저장"
          disabled={!canSave}
          onClick={() => onSave(name.trim(), members)}
        />
      </div>

      <LeaveProjectModal
        open={isLeaveModalOpen}
        step={leaveModalStep}
        loading={isLeaving}
        onClose={closeLeaveModal}
        onLeave={handleLeaveProject}
        onDone={handleLeaveDone}
      />
    </>
  );
}