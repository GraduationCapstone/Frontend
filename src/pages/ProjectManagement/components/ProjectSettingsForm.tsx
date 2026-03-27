import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { Member, ProjectRolePreview } from "../types";
import MemberSearch from "./MemberSearch";
import { Button } from "../../../components/common";
import InputField from "../../../components/common/InputField";
import LeaveProjectModal from "../../../components/common/Modal/LeaveProjectModal";

function ProfileAvatar({ name, imageUrl }: { name: string; imageUrl?: string }) {
  const [imageError, setImageError] = useState(false);
  const initial = name[0]?.toUpperCase() ?? "U";

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  return (
    <div className="w-6 h-6 rounded-full overflow-hidden bg-primary-sg550 text-grayscale-white flex items-center justify-center text-[14px] shrink-0">
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={`${name} profile`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        initial
      )}
    </div>
  );
}

type Props = {
  initialName: string;
  initialMembers: Member[];
  currentRole: ProjectRolePreview;
  allCandidates: Member[];
  onCancel: () => void;
  onSave: (nextName: string, nextMembers: Member[]) => void;
  onLeaveProject?: () => void | Promise<void>;
  onLeaveDone?: () => void;
};

export default function ProjectSettingsForm({
  initialName,
  initialMembers,
  currentRole,
  allCandidates,
  onCancel,
  onSave,
  onLeaveProject,
  onLeaveDone,
}: Props) {
  const hostMember = useMemo(
    () => initialMembers.find((member) => member.role === "OWNER") ?? initialMembers[0] ?? null,
    [initialMembers]
  );
  const initialProjectMembers = useMemo(
    () => (hostMember ? initialMembers.filter((m) => m.id !== hostMember.id) : initialMembers),
    [initialMembers, hostMember]
  );
  const [name, setName] = useState(initialName);
  const [draftMembers, setDraftMembers] = useState<Member[]>(initialProjectMembers);
  const [committedMembers, setCommittedMembers] = useState<Member[]>(initialProjectMembers);
  const pendingAddedMembers = useMemo(
    () =>
      draftMembers.filter(
        (draftMember) => !committedMembers.some((committed) => committed.id === draftMember.id)
      ),
    [draftMembers, committedMembers]
  );
  const visibleMembers = committedMembers;
  const memberCandidateIds = useMemo(
    () => new Set(committedMembers.map((member) => member.id)),
    [committedMembers]
  );
  const memberModeCandidates = useMemo(
    () =>
      allCandidates.filter(
        (candidate) => !memberCandidateIds.has(candidate.id) && candidate.id !== hostMember?.id
      ),
    [allCandidates, memberCandidateIds, hostMember]
  );

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setDraftMembers(initialProjectMembers);
    setCommittedMembers(initialProjectMembers);
  }, [initialProjectMembers]);

  // 나가기 모달
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveModalStep, setLeaveModalStep] = useState<"confirm" | "done">("confirm");
  const [isLeaving, setIsLeaving] = useState(false);

  const canSave = useMemo(() => {
    const nextName = currentRole === "owner" ? name.trim() : initialName.trim();
    if (nextName.length === 0) return false;

    if (nextName !== initialName.trim()) return true;
    if (draftMembers.length !== committedMembers.length) return true;

    const a = [...draftMembers].map((m) => m.id).sort().join(",");
    const b = [...committedMembers].map((m) => m.id).sort().join(",");
    return a !== b;
  }, [currentRole, name, draftMembers, committedMembers, initialName]);

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
          {currentRole === "owner" ? (
            <InputField
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Project name"
              showIcon={false}
            />
          ) : (
            <div className="self-stretch p-2.5 inline-flex justify-start items-center gap-2.5">
              <div className="justify-center text-h3-ko text-grayscale-black">
                {initialName}
              </div>
            </div>
          )}
        </div>

        <div className="self-stretch inline-flex flex-col justify-start items-start gap-3">
          <div className="text-h3-ko text-grayscale-black">멤버 초대</div>
          <MemberSearch
            allCandidates={currentRole === "owner" ? allCandidates : memberModeCandidates}
            selected={currentRole === "owner" ? draftMembers : pendingAddedMembers}
            nonRemovableIds={
              currentRole === "owner" ? [] : committedMembers.map((member) => member.id)
            }
            collapsedUntilSearch={currentRole === "member"}
            onChangeSelected={(next) => {
              if (currentRole === "owner") {
                setDraftMembers(next);
                return;
              }
              setDraftMembers([...committedMembers, ...next]);
            }}
          />
        </div>

        <div className="self-stretch inline-flex flex-col justify-center items-end gap-3">
          <div className="self-stretch justify-center text-h3-ko text-grayscale-black">
            호스트
          </div>

          {hostMember ? (
            <ul className="w-full grid grid-cols-4 gap-x-10 gap-y-4">
              <li className="inline-flex items-center gap-2">
                <ProfileAvatar name={hostMember.username} imageUrl={hostMember.profileImageUrl} />
                <span className="text-h4-ko text-grayscale-black">
                  {hostMember.username}
                </span>
              </li>
            </ul>
          ) : null}

        </div>

        <div className="self-stretch inline-flex flex-col justify-center items-end gap-3">
          <div className="self-stretch justify-center text-h3-ko text-grayscale-black">
            멤버
          </div>

          <ul className="w-full grid grid-cols-4 gap-x-10 gap-y-4">
            {visibleMembers.map((m) => (
              <li key={m.id} className="inline-flex items-center gap-2">
                <ProfileAvatar name={m.username} imageUrl={m.profileImageUrl} />
                <span className="text-h4-ko text-grayscale-black">
                  {m.username}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full inline-flex justify-end items-center gap-2.5">
          <Button
            variant="dynamicClearSTextUnderlined"
            children={undefined}
            label={currentRole === "owner" ? "프로젝트 삭제" : "프로젝트 나가기"}
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
          onClick={() => {
            const nextName = currentRole === "owner" ? name.trim() : initialName.trim();
            setCommittedMembers(draftMembers);
            const nextMembers = hostMember ? [hostMember, ...draftMembers] : draftMembers;
            onSave(nextName, nextMembers);
          }}
        />
      </div>

      <LeaveProjectModal
        open={isLeaveModalOpen}
        step={leaveModalStep}
        mode={currentRole}
        loading={isLeaving}
        onClose={closeLeaveModal}
        onLeave={handleLeaveProject}
        onDone={handleLeaveDone}
      />
    </>
  );
}
