import { useState, useMemo } from 'react';

export type CategoryType = 'All' | 'Public' | 'Sources' | 'Forks' | 'Archived' | 'Templates';

export interface Repository {
  id: number;
  title: string;
  description: string;
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
}

// 더미 데이터 생성
const DUMMY_REPOSITORIES: Repository[] = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  title: `Repository-${i + 1}`,
  description: i % 3 === 0 ? 'This is a description for the repository.' : undefined,
  isPublic: i % 5 !== 0, // 일부는 Private
  language: {
    name: i % 2 === 0 ? 'TypeScript' : 'Java',
    color: i % 2 === 0 ? '#3178C6' : '#B07219',
  },
  stats: {
    forks: Math.floor(Math.random() * 50),
    stars: Math.floor(Math.random() * 100),
    issues: Math.floor(Math.random() * 20),
  },
  updatedAt: 'Updated 1 hour ago',
}));

export const useTestFileSelectModel = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());

  const [projectName, setProjectName] = useState('Project C');
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);

  // 필터링 로직
  const filteredRepositories = useMemo(() => {
    return DUMMY_REPOSITORIES.filter((repo) => {
      // 1. 카테고리 필터 (예시 로직)
      if (selectedCategory === 'Public' && !repo.isPublic) return false;
      // ... 실제 비즈니스 로직에 맞춰 확장 가능

      // 2. 검색어 필터
      if (searchQuery) {
        return repo.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // 레포지토리 선택 토글
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
    // 여기서 API 호출 등을 통해 이름 저장 로직 수행 가능
    setIsEditingProjectName(false);
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
    setProjectName, // InputField onChange용 (직접 string을 받지 않고 event를 받을 수도 있으므로 View에서 처리)
    isEditingProjectName,
    setIsEditingProjectName,
    handleSaveProjectName,
  };
};