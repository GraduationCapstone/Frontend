import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchGithubRepos, postSelectedRepo } from '../../api/github';
import { createProject, inviteMembers, fetchProjectRepos, checkProjectNameDuplicate } from '../../api/project';
import { checkTestNameDuplicate } from '../../api/test';

export type CategoryType = 'All' | 'Public' | 'Private';
// 정렬 옵션 타입 정의
export type SortOptionType = 'Last pushed' | 'Name' | 'Stars';
export type SortOrderType = 'Asc' | 'Desc';

export interface Repository {
  id: string;
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

// 언어별 색상 매핑 헬퍼 함수
const getLanguageColor = (language: string | null) => {
  if (!language) return '#8b949e';
  const colors: Record<string, string> = {
    Java: '#b07219',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
  };
  return colors[language] || '#8b949e';
};

export const useTestFileSelectModel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 전달받은 State 확인 (Home에서 보낸 데이터 받기)
  // NewProject 화면에서 넘어온 State 타입 정의 추가
  const state = location.state as { 
    mode?: 'test' | 'new'; 
    testName?: string; 
    targetProject?: string;
    targetProjectId?: string;
    projectName?: string; // NewProject에서 넘긴 플젝 이름
    invitedMembers?: { userId: number; username: string; email: string; profileImageUrl: string }[];
  } | null;

  const isTestMode = state?.mode === 'test'; // 테스트 모드 여부 확인
  const isNewMode = state?.mode === 'new';

  const [rawRepositories, setRawRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // 데이터 전송 중(버튼 연타 방지) 상태 추가
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<string>>(new Set());

  const [projectName, setProjectName] = useState(
    isNewMode ? (state?.projectName ?? '새 프로젝트') : (isTestMode ? (state?.testName ?? '') : 'Project C')
  );
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  // [추가] 프로젝트명 중복 에러 상태
  const [projectNameError, setProjectNameError] = useState('');

  // [추가] 정렬 관련 상태
  const [sortOption, setSortOption] = useState<SortOptionType>('Last pushed');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('Desc');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // 💡 API 호출 로직 추가
  useEffect(() => {
    const loadRepos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let repoList: any[] = [];
        // ✨ [핵심 로직 교체] 모드에 따라 API 분기 처리
        if (isTestMode && state?.targetProjectId) {
          // 1. [테스트 모드] 특정 프로젝트의 레포지토리만 조회
          const responseData = await fetchProjectRepos(Number(state.targetProjectId));
          repoList = Array.isArray(responseData) ? responseData : [];
        } else {
          // 2. [새 프로젝트 모드] 내 깃허브 전체 레포지토리 조회
          const responseData = await fetchGithubRepos();
          if (Array.isArray(responseData)) repoList = responseData;
          else if (responseData && Array.isArray((responseData as any).data)) repoList = (responseData as any).data;
          else if (responseData && Array.isArray((responseData as any).content)) repoList = (responseData as any).content;
        }

        // 받아온 데이터를 화면에 뿌리기 좋게 매핑 (두 API 응답 형식이 비슷하므로 공통 적용 가능)
        const mappedRepos: Repository[] = repoList.map((repo: any) => {
          // ✨ 날짜 포맷팅 (예: "2026-04-03" 형식으로 변환)
          const dateObj = repo.updatedAt ? new Date(repo.updatedAt) : new Date();
          const formattedDate = repo.updatedAt 
            ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
            : 'Recently';

          return {
            id: repo.id ? repo.id.toString() : `${repo.owner}/${repo.repoName}`,
            title: repo.repoName,
            description: repo.description || undefined,
            isPublic: repo.isPublic ?? true, // ✨ API에서 받아온 값 사용 (값이 없으면 기본값 true)
            language: {
              name: repo.language || 'Unknown',
              color: getLanguageColor(repo.language),
            },
            stats: {
              forks: repo.forksCount || 0,
              stars: repo.stargazersCount || 0,
              issues: repo.openIssuesCount || 0,
            },
            updatedAt: formattedDate, // ✨ 문자열로 변환된 날짜
            updatedAtDate: dateObj,   // ✨ 정렬 로직을 위해 사용하는 Date 객체
          };
        });
        
        setRawRepositories(mappedRepos);
      } catch (err: any) {
        if (err.response?.status === 401) setError('인증이 만료되었습니다. 다시 로그인해 주세요.');
        else if (err.response?.status === 404) setError('해당 프로젝트를 찾을 수 없습니다.');
        else setError('레포지토리 목록을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRepos();
  }, []);

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
    let targetList = rawRepositories;

    let result = targetList.filter((repo) => {
      // 1. 카테고리 필터
      if (selectedCategory === 'Public' && !repo.isPublic) return false;
      if (selectedCategory === 'Private' && repo.isPublic) return false;

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
  }, [rawRepositories, selectedCategory, searchQuery, sortOption, sortOrder]);

  const toggleRepositorySelection = (id: string) => {
    const newSet = new Set(selectedRepoIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRepoIds(newSet);
  };

  const handleSaveProjectName = async () => {
    const trimmedName = projectName.trim();
    
    // 빈 값 체크 (이전 QA 반영)
    if (trimmedName === '') {
      setProjectNameError('프로젝트명을 입력해주세요.');
      return;
    }

    try {
      // API 호출 (true = 중복, false = 사용 가능)
      const isDuplicated = await checkProjectNameDuplicate(trimmedName);
      
      if (isDuplicated) {
        // 중복 시 에러 메시지 세팅하고 편집 모드 유지
        setProjectNameError('생성하신 프로젝트와 중복된 프로젝트 명은 사용할 수 없습니다.');
      } else {
        // 성공 시 에러 초기화 및 편집 모드 종료
        setProjectNameError('');
        setIsEditingProjectName(false);
      }
    } catch (error) {
      console.error("프로젝트명 중복 체크 실패:", error);
      setProjectNameError('중복 체크 중 오류가 발생했습니다.');
    }
  };

  // ✨ 테스트 모드용 저장 함수 완전히 분리
  const handleSaveTestName = async () => {
    const trimmedName = projectName.trim();
    
    // 빈 값 체크 (테스트명)
    if (trimmedName === '') {
      setProjectNameError('테스트명을 입력해주세요.'); // ✨ 에러 메시지 분리
      return;
    }

    try {
      const projectId = state?.targetProjectId;
      if (!projectId) throw new Error("프로젝트 ID가 없습니다.");

      const isDuplicated = await checkTestNameDuplicate(projectId, trimmedName);
      
      if (isDuplicated) {
        setProjectNameError('해당 프로젝트에 이미 존재하는 테스트명입니다.');
      } else {
        setProjectNameError('');
        setIsEditingProjectName(false);
      }
    } catch (error) {
      console.error("테스트명 중복 체크 실패:", error);
      setProjectNameError('중복 체크 중 오류가 발생했습니다.');
    }
  };

  const handleNextClick = async () => {
    if (selectedRepoIds.size > 0) {
      if (isTestMode) {
        navigate('/test-scenario', { 
          state: {
            testName: projectName,
            targetProjectId: state?.targetProjectId, // Home에서 받아온 프로젝트 ID
            selectedRepoIds: Array.from(selectedRepoIds)
           }
        });
      } else {
        setIsSubmitting(true);
        setError(null);

        try {
          // [Step 1] 선택된 레포지토리 저장 (병렬 요청)
          const selectedReposData = rawRepositories.filter(repo => selectedRepoIds.has(repo.id));
          const repoResponses = await Promise.all(
            selectedReposData.map(repo => {
              const [owner, repoName] = repo.id.split('/'); 
              return postSelectedRepo({
                repoName,
                owner,
                description: repo.description,
                language: repo.language.name === 'Unknown' ? undefined : repo.language.name,
                forksCount: repo.stats.forks,
                stargazersCount: repo.stats.stars,
                openIssuesCount: repo.stats.issues,
                isPublic: repo.isPublic, // ✨ 새로 추가: 저장해둔 isPublic 값 전송
                // ✨ 새로 추가: Date 객체를 백엔드가 요구하는 ISO 문자열 형식("2026-04-03T08:42:10.561Z")으로 변환하여 전송
                updatedAt: repo.updatedAtDate.toISOString(),
              });
            })
          );
          
          // 받아온 레포지토리 ID들 추출
          const extractedRepoIds = repoResponses.map(res => res.id);

          // [Step 2] 프로젝트 생성 (레포 ID들 포함)
          const projectResponse = await createProject({
            projectName: projectName, // 화면 좌측 상단에 반영된 이름
            repoIds: extractedRepoIds
          });
          
          const newProjectId = projectResponse.id;

          // 방금 생성된 새 프로젝트의 ID를 로컬 스토리지에 '가장 최근에 선택한 프로젝트'로 강제 덮어쓰기 합니다.
          localStorage.setItem("lastSelectedProjectId", newProjectId.toString());

          // [Step 3] 넘겨받은 초대 멤버가 있다면 멤버 초대 API 호출
          if (state?.invitedMembers && state.invitedMembers.length > 0) {
            const emailList = state.invitedMembers.map(member => member.email);

            const invitePayload = { emails: emailList };
            console.log("🚀 [POST 요청 전송] 멤버 초대 API Payload:", invitePayload);
            console.log(`🚀 전송 주소: /api/projects/${newProjectId}/invite`);
            
            await inviteMembers(newProjectId, { emails: emailList });
          }

          // [성공] 3단계가 모두 에러 없이 통과했을 때만 모달 띄우기
          setIsCompleteModalOpen(true);

        } catch (err: any) {
          // [실패] 에러 발생 시 try 블록을 즉시 탈출하여 모달이 뜨지 않음
          console.error("다단계 폼 API 연쇄 호출 실패:", err);
          if (err.response?.status === 401) {
            setError('인증이 만료되었습니다. 다시 로그인해 주세요.');
          } else {
            setError('프로젝트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
        } finally {
          setIsSubmitting(false); // 로딩 상태 해제
        }
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
    isTestMode,
    isLoading,
    isSubmitting,
    error,
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
    projectNameError,
    isEditingProjectName,
    setIsEditingProjectName,
    handleSaveProjectName,
    handleSaveTestName,
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