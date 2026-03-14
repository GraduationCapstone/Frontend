// src/pages/Home/HomeModel.tsx
import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { fetchProjects } from '../../api/project';

export const useHomeModel = () => {
  const navigate = useNavigate();
  // 1. 상태 관리 (Data)
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [testName, setTestName] = useState<string>('');

  const [projectItems, setProjectItems] = useState<{ value: string; label: string }[]>([]);
  // API 로딩 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 화면이 켜질 때 API 호출해서 드롭박스 아이템 채우기
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProjects();
        // 백엔드 데이터를 Dropbox 컴포넌트에 맞는 형태로 변환
        const formattedItems = data.map((project) => ({
          value: project.id.toString(), // 다음 페이지로 넘길 projectName을 value로 사용
          label: project.projectName, // 화면에 보여질 이름
        }));
        setProjectItems(formattedItems);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

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

    const selectedProjectName = projectItems.find(item => item.value === selectedProject)?.label || '';

    navigate('/test-file-select', { 
      state: { 
        mode: 'test',             // 'test' 모드임을 명시
        testName: testName,       // 입력한 테스트명 전달
        targetProject: selectedProjectName, // 선택한 프로젝트명 전달 (이걸로 리포지토리 필터링)
        targetProjectId: selectedProject, // 선택한 프로젝트의 ID도 전달
      } 
    });
  };

  // Controller에서 사용할 값과 함수들을 반환
  return {
    projectItems,
    selectedProject,
    testName,
    canStart,
    isLoading,
    handleProjectChange,
    handleTestNameChange,
    handleStartTest,
  };
};