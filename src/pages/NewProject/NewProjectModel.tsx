import { useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';

import type { User, CreateProjectRequest, CreateProjectResponse, InviteMembersRequest } from './types';

export default function useNewProjectModel() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [invitedMembers, setInvitedMembers] = useState<User[]>([]);

  // API 통신 중 버튼 중복 클릭 방지를 위한 상태
  const [isLoading, setIsLoading] = useState(false);

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
  const canProceed = projectName.trim().length > 0 && !isLoading;

  const handleNext = async () => {
    if (!canProceed) return;
    
    setIsLoading(true);

    // [임시 처리] 실패할 경우를 대비해 기본 ID를 999로 세팅해둡니다.
    let currentProjectId = 999;

    try {
      // 1. 첫 번째 API: 프로젝트 생성
      const projectPayload: CreateProjectRequest = {
        projectName: projectName,
        repoIds: [] 
      };

      const projectResponse = await axiosInstance.post<CreateProjectResponse>('/api/projects', projectPayload);

      if (projectResponse.status === 200 || projectResponse.status === 201) {
        // 성공 시 진짜 ID로 교체
        currentProjectId = projectResponse.data.id; 
        console.log('✅ 프로젝트 생성 성공:', currentProjectId);

        if (invitedMembers.length > 0) {
          const emailList = invitedMembers.map((member) => member.name); 
          const invitePayload: InviteMembersRequest = { emails: emailList };
          await axiosInstance.post(`/api/projects/${currentProjectId}/invite`, invitePayload);
          console.log('✅ 멤버 초대 성공:', emailList);
        }
      }
    } catch (error) {
      // [임시 처리] 실패하더라도 에러만 로그로 남기고 흐름을 멈추지 않습니다.
      console.error('❌ API 통신 실패 (로그인 연동 전 임시 무시):', error);
      console.log('⚠️ 강제로 다음 페이지로 이동합니다. (임시 ID: 999 사용)');
    } finally {
      setIsLoading(false);
      
      // [임시 처리] 성공/실패 여부와 상관없이 무조건 다음 페이지로 넘어갑니다!
      navigate('/test-file-select', { state: { projectId: currentProjectId } });
    }
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