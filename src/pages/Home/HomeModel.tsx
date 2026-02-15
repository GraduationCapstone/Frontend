// src/pages/Home/HomeModel.tsx
import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 

export const useHomeModel = () => {
  const navigate = useNavigate();
  // 1. 상태 관리 (Data)
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [testName, setTestName] = useState<string>('');

  // 2. Mock Data (실제 API 연동 시 이 부분을 대체)
  const projectItems = [
    { value: 'project-a', label: 'Project A' },
    { value: 'project-b', label: 'Project B' },
    { value: 'project-c', label: 'Project C' },
  ];

  // 3. 비즈니스 로직 (Logic)
  // 프로젝트와 테스트명이 모두 입력되어야 시작 가능
  const canStart = !!selectedProject && testName.length > 0;

  // 4. 이벤트 핸들러 (Actions)
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
  };

  const handleTestNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTestName(e.target.value);
  };

  const handleStartTest = () => {
    if (!canStart) return;
    // state 객체에 모드(mode)와 필요한 데이터를 담아서 보냅니다.
    navigate('/test-file-select', { 
      state: { 
        mode: 'test',             // 'test' 모드임을 명시
        testName: testName,       // 입력한 테스트명 전달
        targetProject: selectedProject // 선택한 프로젝트명 전달 (이걸로 리포지토리 필터링)
      } 
    });
  };

  // Controller에서 사용할 값과 함수들을 반환
  return {
    projectItems,
    selectedProject,
    testName,
    canStart,
    handleProjectChange,
    handleTestNameChange,
    handleStartTest,
  };
};