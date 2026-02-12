import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type CategoryType = 'All' | 'Public' | 'Sources' | 'Forks' | 'Archived' | 'Templates';
// 정렬 옵션 타입 정의
export type SortOptionType = 'Last pushed' | 'Name' | 'Stars';
export type SortOrderType = 'Asc' | 'Desc';

export interface Repository {
  id: number;
  title: string;
  description?: string | undefined;
  isPublic: boolean;
  language: {
    name: string;
    color: string;
  };
  stats: {
    forks: number;
    stars: number;
    issues: number;
  };
  updatedAt: string;
  updatedAtDate: Date; // 정렬 로직용 날짜 객체
}

// 더미 데이터 생성 (날짜 정렬 테스트를 위해 랜덤 날짜 부여)
const DUMMY_REPOSITORIES: Repository[] = Array.from({ length: 15 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // 최근 30일 내 랜덤
  
  return {
    id: i,
    title: `Repository-${i + 1}`,
    description: i % 3 === 0 ? 'This is a description for the repository.' : undefined,
    isPublic: i % 5 !== 0,
    language: {
      name: i % 2 === 0 ? 'TypeScript' : 'Java',
      color: i % 2 === 0 ? '#3078C6' : '#B07219',
    },
    stats: {
      forks: Math.floor(Math.random() * 50),
      stars: Math.floor(Math.random() * 100),
      issues: Math.floor(Math.random() * 20),
    },
    updatedAt: `${Math.floor(Math.random() * 24) + 1} hours ago`,
    updatedAtDate: date,
  };
});

export const useTestFileSelectModel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 전달받은 State 확인 (Home에서 보낸 데이터 받기)
  const state = location.state as { mode?: 'test'; testName?: string; targetProject?: string } | null;
  const isTestMode = state?.mode === 'test'; // 테스트 모드 여부 확인

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());

  const [projectName, setProjectName] = useState(isTestMode ? (state?.testName ?? '') : 'Project C');
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);

  // [추가] 정렬 관련 상태
  const [sortOption, setSortOption] = useState<SortOptionType>('Last pushed');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('Desc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // [추가] 정렬 핸들러
  const toggleSortDropdown = () => setIsSortDropdownOpen((prev) => !prev);
  const closeSortDropdown = () => setIsSortDropdownOpen(false);

  const handleSortOptionChange = (option: SortOptionType) => {
    setSortOption(option);
    // 옵션 선택 시 드롭다운 닫지 않음 (피그마 UX 추정)
  };

  const handleSortOrderChange = (order: SortOrderType) => {
    setSortOrder(order);
  };

  // 필터링 및 정렬 로직
  const filteredRepositories = useMemo(() => {
    let targetList = DUMMY_REPOSITORIES;

    // [New] 테스트 모드일 경우: 선택된 프로젝트에 해당하는 리포지토리만 남김
    if (isTestMode && state?.targetProject) {
      // 실제로는 프로젝트 ID로 API를 호출하거나 매핑된 정보를 찾아야 합니다.
      // 지금은 더미 데이터이므로, 'targetProject' 이름이 포함된 리포지토리만 보여주거나
      // 임시로 첫 번째 리포지토리만 보여주는 식으로 시뮬레이션 합니다.
      
      // 예시: 더미 데이터 중 ID가 0인 것 하나만 보여줌 (실제 로직에 맞게 수정 필요)
      targetList = DUMMY_REPOSITORIES.slice(0, 1); 
    }

    let result = targetList.filter((repo) => {
      // 1. 카테고리 필터
      if (selectedCategory === 'Public' && !repo.isPublic) return false;

      // 2. 검색어 필터
      if (searchQuery) {
        return repo.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });

    // 3. 정렬 로직
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'Name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'Stars':
          comparison = a.stats.stars - b.stats.stars;
          break;
        case 'Last pushed':
        default:
          comparison = a.updatedAtDate.getTime() - b.updatedAtDate.getTime();
          break;
      }
      return sortOrder === 'Asc' ? comparison : -comparison;
    });

    return result;
  }, [selectedCategory, searchQuery, sortOption, sortOrder, isTestMode, state?.targetProject]);

  const toggleRepositorySelection = (id: number) => {
    const newSet = new Set(selectedRepoIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRepoIds(newSet);
  };

  const handleSaveProjectName = () => {
    setIsEditingProjectName(false);
  };

  const handleNextClick = () => {
    // 선택된 리포지토리가 있을 때만 모달 오픈
    if (selectedRepoIds.size > 0) {
      if (isTestMode) {
        navigate('/test-scenario', { 
          state: { 
            testName: projectName 
          } 
        });
      } else {
        // [새 프로젝트 모드] -> 완료 모달 띄우기 (기존 로직 유지)
        setIsCompleteModalOpen(true);
      }
    }
  };

  const handleCompleteConfirm = () => {
    setIsCompleteModalOpen(false);
    navigate('/home'); // 또는 '/' 로 설정
  };

  const handleCloseModal = () => {
    setIsCompleteModalOpen(false);
  };

  return {
    selectedCategory,
    handleCategoryChange: setSelectedCategory,
    searchQuery,
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    repositories: filteredRepositories,
    totalCount: filteredRepositories.length,
    selectedRepoIds,
    toggleRepositorySelection,
    projectName,
    setProjectName, 
    isEditingProjectName,
    setIsEditingProjectName,
    handleSaveProjectName,
    // 정렬 관련 내보내기
    sortOption,
    sortOrder,
    isSortDropdownOpen,
    toggleSortDropdown,
    closeSortDropdown,
    handleSortOptionChange,
    handleSortOrderChange,
    isCompleteModalOpen,
    handleNextClick,
    handleCompleteConfirm,
    handleCloseModal,
  };
};