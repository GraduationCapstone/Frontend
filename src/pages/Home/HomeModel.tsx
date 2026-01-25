// src/pages/Home/HomeModel.tsx
import { useState, ChangeEvent } from 'react';

export const useHomeModel = () => {
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
    alert(`테스트 시작!\n프로젝트: ${selectedProject}\n테스트명: ${testName}`);
    // 여기에 페이지 이동이나 API 호출 로직 추가
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