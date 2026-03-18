import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from './types';
import { searchUsers } from '../../api/project';

export default function useNewProjectModel() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<User[]>([]);

  // ✨ [추가] API에서 받아온 검색 결과를 담을 State
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // ✨ [수정] 검색어가 바뀔 때마다 API 호출 (디바운싱 적용)
  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = memberSearchQuery.trim();
      if (!query) {
        setSearchResults([]); // 검색어가 없으면 결과 초기화
        return;
      }

      try {
        const results = await searchUsers(query);
        // 이미 초대 목록에 있는 유저는 검색 결과에서 제외
        const filteredResults = results.filter(
          (user) => !invitedMembers.some((invited) => invited.userId === user.userId)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("유저 검색 실패:", error);
        setSearchResults([]);
      }
    };

    // 사용자가 타자를 치는 동안에는 API 호출을 잠시 대기 (0.3초)
    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    // 타자를 계속 치면 이전 타이머를 취소
    return () => clearTimeout(timer);
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
    if (!invitedMembers.some((m) => m.userId === user.userId)) {
      setInvitedMembers((prev) => [...prev, user]);
    }
    // 선택 후 검색어 초기화
    setMemberSearchQuery('');
  };

  const handleRemoveInvitedUser = (user: User) => {
    setInvitedMembers((prev) => prev.filter((m) => m.userId !== user.userId));
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