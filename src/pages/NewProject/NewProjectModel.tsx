import { useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from './types';

export default function useNewProjectModel() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<User[]>([]);

  // 임시 유저 데이터 (초대 API 테스트를 위해 name을 이메일 형식으로 수정해두면 좋습니다)
  const allUsers: User[] = [
    { id: 'user1', name: 'user1@gmail.com' },
    { id: 'user2', name: 'user2@naver.com' },
    { id: 'user3', name: 'user3@test.com' },
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

  // 프로젝트 이름이 있고, 통신 중이 아닐 때만 다음 단계 진행 가능
  const canProceed = projectName.trim().length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    
    navigate('/test-file-select', { 
      state: { 
        mode: 'new', // 새 프로젝트 생성 모드임을 명시
        projectName: projectName,
        invitedMembers: invitedMembers, 
      } 
    });
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