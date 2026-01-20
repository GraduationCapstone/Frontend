import { useState, ChangeEvent } from 'react';

export default function useNewProjectModel() {
  const [projectName, setProjectName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]);

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleMemberSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberSearchQuery(e.target.value);
  };

  const canProceed = projectName.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    console.log('Next Step:', { projectName, invitedMembers });
    // TODO: 프로젝트 생성 API 호출 또는 페이지 이동
  };

  return {
    projectName,
    memberSearchQuery,
    invitedMembers,
    canProceed,
    handleProjectNameChange,
    handleMemberSearchChange,
    handleNext,
  };
}