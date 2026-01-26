import type { useTestFileSelectModel } from './TestFileSelectModel';

// Components
import { DynamicWhiteMIconTextButton } from '../../components/common/ListButton/ListButton';
import InputField from '../../components/common/InputField';
import RepositoryListItem from '../../components/common/ListItem/RepositoryListItem';
import FloatingBtn from '../../components/common/FloatingBtn';
import SelectTrigger from '../../components/common/TriggerButton/SelectTrigger';
import { Button } from '../../components/common/Button/Button';
import ConfirmModal from '../../components/common/Modal/ConfirmModal';
// Icons
import EntireIcon from '../../assets/icons/entire.svg?react';
import GlobeIcon from '../../assets/icons/globe.svg?react';
import RepoIcon from '../../assets/icons/repo.svg?react';
import ForkIcon from '../../assets/icons/fork.svg?react';
import ArchiveIcon from '../../assets/icons/archive.svg?react';
import TemplateIcon from '../../assets/icons/repo_template.svg?react';
import PencilIcon from '../../assets/icons/pencil.svg?react';
import CheckIcon from '../../assets/icons/check.svg?react';
import RepoPushIcon from '../../assets/icons/repo_push.svg?react';
import TypoIcon from '../../assets/icons/typo.svg?react';
import StarIcon from '../../assets/icons/star.svg?react';
import AscIcon from '../../assets/icons/asc.svg?react';
import DescIcon from '../../assets/icons/desc.svg?react';

// Types
import type { CategoryType } from './TestFileSelectModel';

interface Props extends ReturnType<typeof useTestFileSelectModel> {}

const CATEGORIES: { label: CategoryType; icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }[] = [
  { label: 'All', icon: EntireIcon },
  { label: 'Public', icon: GlobeIcon },
  { label: 'Sources', icon: RepoIcon },
  { label: 'Forks', icon: ForkIcon },
  { label: 'Archived', icon: ArchiveIcon },
  { label: 'Templates', icon: TemplateIcon },
];

export default function TestFileSelectView({
  selectedCategory,
  handleCategoryChange,
  searchQuery,
  handleSearchChange,
  repositories,
  totalCount,
  selectedRepoIds,
  toggleRepositorySelection,
  projectName,
  setProjectName,
  isEditingProjectName,
  setIsEditingProjectName,
  handleSaveProjectName,
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
}: Props) {

  const isNextButtonEnabled = selectedRepoIds.size > 0;

  // [Helper] 드롭다운 아이템 렌더링 함수
  const renderDropdownItem = (
    label: string,
    isSelected: boolean,
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    onClick: () => void
  ) => {
    return (
      <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className={`
          self-stretch 
          flex justify-start items-center gap-2
          /* 선택 여부에 따른 패딩 변화 (Clicked: px-3, Default: px-10) */
          ${isSelected ? 'px-3 py-2' : 'px-10 py-2'}
          bg-grayscale-white 
          hover:bg-grayscale-gy100
          transition-all duration-200
        `}
      >
        {/* 선택된 경우 체크 아이콘 표시 */}
        {isSelected && (
          <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center shrink-0">
             <CheckIcon className="w-3.5 h-2.5 [&_path]:stroke-grayscale-black [&_path]:stroke-2" />
          </div>
        )}

        {/* 메인 아이콘 */}
        <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 [&_path]:fill-grayscale-black" />
        </div>

        {/* 라벨 텍스트 */}
        <div className="flex-1 text-left text-grayscale-black text-xs font-medium font-['Pretendard'] leading-4 line-clamp-1">
          {label}
        </div>
      </button>
    );
  };

  return (
    // [Screen Scroll] 화면 전체 높이 최소값 설정
    <div 
        className="w-full min-h-[calc(100vh-5rem)] flex bg-grayscale-white relative"
        onClick={() => isSortDropdownOpen && closeSortDropdown()}
    >
      
      {/* 1. Sidebar (Left) */}
      <div className="w-overlay-side-sheet bg-grayscale-white flex flex-col items-start py-16 px-gap-xl gap-15 z-20 shrink-0 border-r border-grayscale-gy200/50">
        
        {/* Project Header Area */}
        {isEditingProjectName ? (
          // [Edit Mode] : InputField + Save Button
          <div className="self-stretch flex flex-col justify-start items-center gap-3">
            <InputField
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              showIcon={false} 
              placeholder="Project Name"
              widthClass="w-full"
              heightClass="h-12"
              className="shadow-inner rounded-2xl bg-grayscale-white pl-5 pr-4 text-h4-ko text-grayscale-black"
            />
            {/* 저장 버튼: 피그마 스타일 (bg-grayscale-gy900, text-white, px-4 py-2) */}
            <Button 
                variant="dynamicSg500SText"
                className="hover:bg-grayscale-gy800" // 기본 hover 색상(Primary) 대신 회색 계열을 원하실 경우 추가
                onClick={handleSaveProjectName}
            >
                저장
            </Button>
          </div>
        ) : (
          // [Default Mode] : Project Name + Edit Icon
          <div className="w-full pl-2 py-2 flex justify-between items-center">
            <span className="text-h3-ko text-grayscale-black truncate">{projectName}</span>
            <button 
              type="button" 
              className="p-1 rounded-lg flex items-center justify-center hover:bg-grayscale-gy100 transition-colors"
              aria-label="Edit Project Name"
              onClick={() => setIsEditingProjectName(true)}
            >
              <PencilIcon className="w-6 h-6 [&_*]:fill-grayscale-black" />
            </button>
          </div>
        )}

        {/* Menu List */}
        <div className="w-full flex flex-col gap-1">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.label;
            return (
              <DynamicWhiteMIconTextButton
                key={category.label}
                label={category.label}
                leading={{ type: 'icon', icon: 'plus' }}
                icons={{ plus: category.icon }} 
                selected={isSelected}
                onClick={() => handleCategoryChange(category.label)}
                // 선택 시 배경색(secondary-sg100)과 텍스트(primary-sg600)만 변경
                className={`w-full justify-start transition-colors duration-200 rounded-xl ${
                    isSelected 
                      ? 'bg-secondary-sg100! text-primary-sg600!' 
                      : 'hover:bg-grayscale-gy100 text-grayscale-black'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 h-full bg-grayscale-gy50 flex flex-col px-28 pt-24 pb-5 gap-10 relative min-w-0">
        
        {/* Title & Search Bar Area */}
        <div className="w-full flex flex-col gap-10 shrink-0">
            {/* Title */}
            <div className="w-full text-left text-h2-ko text-grayscale-black">
                {selectedCategory}
            </div>

            {/* Search Bar */}
            <div className="w-full">
                <InputField
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Repositories"
                  widthClass="w-full"
                  heightClass="h-[3rem]"
                  className="shadow-is-100 rounded-2xl bg-grayscale-white"
                />
            </div>
        </div>

        {/* [List Area Scroll] List Box Container */}
        {/* 높이 45.75rem(732px) 고정, 내부 스크롤 적용 */}
        <div className="w-full h-183 flex flex-col rounded-lg border border-grayscale-gy300 bg-grayscale-white shadow-sm overflow-hidden shrink-0">
          
          {/* List Header */}
          <div className="w-full px-5 py-1 bg-grayscale-gy200 flex justify-between items-center border-b border-grayscale-gy300 shrink-0">
            <div className="flex items-center gap-1 text-h4-ko text-grayscale-black">
              <span>0</span>
              <span>/</span>
              <span>{totalCount}</span>
              <span>repositories</span>
            </div>
            
            {/* Sort Dropdown Area */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
               {/* Trigger Button */}
               <SelectTrigger 
                  label={sortOption} 
                  variant="dynamic" 
                  className="bg-transparent border-none py-2 cursor-pointer focus:bg-transparent"
                  onClick={toggleSortDropdown}
               />

               {/* [New] Dropdown Menu Implementation */}
               {isSortDropdownOpen && (
                 <div 
                    className="
                        absolute 
                        /* Position: 아래로 16px(1rem), 왼쪽으로 5px(0.3125rem) */
                        top-[calc(100%+1rem)] right-1.25 
                        /* Width: 14.5rem (var(--overlay-dropdown-menu)) */
                        w-(--overlay-dropdown-menu)
                        py-3 
                        bg-grayscale-white 
                        rounded-xl 
                        shadow-ds-200 
                        flex flex-col justify-start items-start gap-0.5 
                        z-50
                    "
                 >
                    {/* 1. Sort Options */}
                    {renderDropdownItem('Last pushed', sortOption === 'Last pushed', RepoPushIcon, () => handleSortOptionChange('Last pushed'))}
                    {renderDropdownItem('Name', sortOption === 'Name', TypoIcon, () => handleSortOptionChange('Name'))}
                    {renderDropdownItem('Stars', sortOption === 'Stars', StarIcon, () => handleSortOptionChange('Stars'))}
                    
                    {/* Divider */}
                    <div className="self-stretch px-2 py-1 flex flex-col justify-start items-start">
                        <div className="self-stretch h-px bg-grayscale-gy300" />
                    </div>

                    {/* 2. Order Options */}
                    {renderDropdownItem('오름차순', sortOrder === 'Asc', AscIcon, () => handleSortOrderChange('Asc'))}
                    {renderDropdownItem('내림차순', sortOrder === 'Desc', DescIcon, () => handleSortOrderChange('Desc'))}
                 </div>
               )}
            </div>
          </div>

          {/* Scrollable List Items Area */}
          <div className="w-full flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {repositories.map((repo) => (
              <RepositoryListItem
                key={repo.id}
                title={repo.title}
                description={repo.description}
                isPublic={repo.isPublic}
                language={repo.language}
                stats={repo.stats}
                updatedAt={repo.updatedAt}
                selected={selectedRepoIds.has(repo.id)}
                onSelectChange={() => toggleRepositorySelection(repo.id)}
                activityGraph={
                  <div className="w-44 h-9 border-2 border-primary-sg500/50 rounded-sm opacity-50" />
                }
              />
            ))}
            
            {/* Empty State */}
            {repositories.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-grayscale-gy500 text-h3-ko">
                No repositories found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Floating Action Button */}
      <div className="absolute right-10 bottom-5 z-50">
        <FloatingBtn 
            onClick={handleNextClick}
            disabled={!isNextButtonEnabled}
        >
          다음
        </FloatingBtn>
      </div>
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isCompleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleCompleteConfirm}
        confirmLabel="확인"
      >
        {/* 모달 본문 내용 */}
        <div className="text-h3-ko text-grayscale-black text-center">
          새 프로젝트를 생성했습니다.
        </div>
      </ConfirmModal>
    </div>
  );
}