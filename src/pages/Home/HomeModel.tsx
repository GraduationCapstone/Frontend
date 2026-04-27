// src/pages/Home/HomeModel.tsx
import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { fetchProjects } from '../../api/project';
import { checkTestNameDuplicate } from '../../api/test';

export const useHomeModel = () => {
  const navigate = useNavigate();
  // 1. 상태 관리 (Data)
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [testName, setTestName] = useState<string>('');
  const [testNameError, setTestNameError] = useState<string>('');

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

  const handleStartTest = async () => {
    if (!canStart) return;

    try {
      // 1. 중복 체크 API 호출
      const isDuplicated = await checkTestNameDuplicate(selectedProject, testName);

      if (isDuplicated) {
        // 2-1. 중복이면 에러 메시지 띄우고 다음 화면으로 넘어가는 것 중단
        setTestNameError('해당 프로젝트에 이미 존재하는 테스트명입니다. 다른 이름을 입력해주세요.');
        return;
      }

      // 2-2. 중복이 아니면 통과 -> 다음 화면으로 이동
      setTestNameError('');
      const selectedProjectName = projectItems.find(item => item.value === selectedProject)?.label || '';

      navigate('/test-file-select', { 
        state: { 
          mode: 'test',
          testName: testName,
          targetProject: selectedProjectName,
          targetProjectId: selectedProject,
        } 
      });
    } catch (error) {
      console.error("테스트명 중복 체크 실패:", error);
      setTestNameError('중복 체크 중 오류가 발생했습니다.');
    }
  };

  // Controller에서 사용할 값과 함수들을 반환
  return {
    projectItems,
    selectedProject,
    testName,
    testNameError,
    canStart,
    isLoading,
    handleProjectChange,
    handleTestNameChange,
    handleStartTest,
  };
};