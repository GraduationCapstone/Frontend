import { useState, ChangeEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  name: string;
}

export default function useNewProjectModel() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<User[]>([]);

  const allUsers: User[] = [
    { id: 'user1', name: 'User1234' },
    { id: 'user2', name: 'User2345' },
    { id: 'user3', name: 'User3456' },
    { id: 'user4', name: 'User4567' },
    { id: 'user5', name: 'User5678' },
    { id: 'user6', name: 'User6789' },
  ];

  // [Logic] 검색어가 있으면 필터링 (Model의 역할)
  const searchResults = useMemo(() => {
    const query = memberSearchQuery.trim().toLowerCase();
    if (!query) return [];
    return allUsers.filter((user) => 
      user.name.toLowerCase().startsWith(query) && 
      !invitedMembers.some((invited) => invited.id === user.id)
    );
  }, [memberSearchQuery, invitedMembers]);

  const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleMemberSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberSearchQuery(e.target.value);
  };

  // [Logic] 유저 선택 시 처리
  const handleSelectUser = (user: User) => {
   // 중복 방지 (searchResults에서 이미 걸러지지만 안전장치)
    if (!invitedMembers.some((m) => m.id === user.id)) {
      setInvitedMembers((prev) => [...prev, user]);
    }
    // 선택 후 검색어 초기화
    setMemberSearchQuery('');
  };

  const handleRemoveInvitedUser = (user: User) => {
    setInvitedMembers((prev) => prev.filter((m) => m.id !== user.id));
  };

  const canProceed = projectName.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    console.log('Next Step:', { projectName, invitedMembers });
    navigate('/test-file-select');
  };

  return {
    projectName,
    memberSearchQuery,
    searchResults,
    invitedMembers,
    canProceed,
    handleProjectNameChange,
    handleMemberSearchChange,
    handleSelectUser,
    handleRemoveInvitedUser,
    handleNext,
  };
}