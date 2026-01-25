import type { useTestFileSelectModel } from './TestFileSelectModel';

// Components
import { DynamicWhiteMIconTextButton } from '../../components/common/ListButton/ListButton';
import InputField from '../../components/common/InputField';
import RepositoryListItem from '../../components/common/ListItem/RepositoryListItem';
import FloatingBtn from '../../components/common/FloatingBtn';
import SelectTrigger from '../../components/common/TriggerButton/SelectTrigger';
import { Button } from '../../components/common/Button/Button';
// Icons
import EntireIcon from '../../assets/icons/entire.svg?react';
import GlobeIcon from '../../assets/icons/globe.svg?react';
import RepoIcon from '../../assets/icons/repo.svg?react';
import ForkIcon from '../../assets/icons/fork.svg?react';
import ArchiveIcon from '../../assets/icons/archive.svg?react';
import TemplateIcon from '../../assets/icons/repo_template.svg?react';
import PencilIcon from '../../assets/icons/pencil.svg?react';

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
}: Props) {

  const isNextButtonEnabled = selectedRepoIds.size > 0;

  return (
    // [Screen Scroll] 화면 전체 높이 최소값 설정
    <div className="w-full min-h-[calc(100vh-5rem)] flex bg-grayscale-white relative">
      
      {/* 1. Sidebar (Left) */}
      <div className="w-overlay-side-sheet bg-grayscale-white flex flex-col items-start py-16 px-gap-xl gap-[3.75rem] z-20 shrink-0 border-r border-grayscale-gy200/50">
        
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
          <div className="w-full pl-[0.5rem] py-[0.5rem] flex justify-between items-center">
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
        <div className="w-full flex flex-col gap-[0.25rem]">
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
                      ? '!bg-secondary-sg100 !text-primary-sg600' 
                      : 'hover:bg-grayscale-gy100 text-grayscale-black'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 h-full bg-grayscale-gy50 flex flex-col px-[7rem] pt-[6rem] pb-[1.25rem] gap-[2.5rem] relative min-w-0">
        
        {/* Title & Search Bar Area */}
        <div className="w-full flex flex-col gap-[2.5rem] shrink-0">
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
        <div className="w-full h-[45.75rem] flex flex-col rounded-lg border border-grayscale-gy300 bg-grayscale-white shadow-sm overflow-hidden shrink-0">
          
          {/* List Header */}
          <div className="w-full px-[1.25rem] py-[0.25rem] bg-grayscale-gy200 flex justify-between items-center border-b border-grayscale-gy300 shrink-0">
            <div className="flex items-center gap-[0.25rem] text-h4-ko text-grayscale-black">
              <span>0</span>
              <span>/</span>
              <span>{totalCount}</span>
              <span>repositories</span>
            </div>
            
            {/* Sort Dropdown */}
            <div className="w-auto">
               <SelectTrigger 
                  label="Last pushed" 
                  variant="dynamic" 
                  className="bg-transparent border-none py-2"
               />
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
                  <div className="w-[11rem] h-[2.25rem] border-2 border-primary-sg500/50 rounded-sm opacity-50" />
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
      <div className="absolute right-[2.5rem] bottom-[1.25rem] z-50">
        <FloatingBtn 
            onClick={() => { 
                if (isNextButtonEnabled) {
                    /* Navigate Logic */ 
                    console.log("Go to next step");
                }
            }}
            disabled={!isNextButtonEnabled}
        >
          다음
        </FloatingBtn>
      </div>
      
    </div>
  );
}