import { ChangeEvent } from 'react';
import FloatingBtn from '../../components/common/FloatingBtn';
import SearchIcon from '../../assets/icons/search.svg?react'; 

interface NewProjectViewProps {
  projectName: string;
  memberSearchQuery: string;
  canProceed: boolean;
  onProjectNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMemberSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export default function NewProjectView({
  projectName,
  memberSearchQuery,
  canProceed,
  onProjectNameChange,
  onMemberSearchChange,
  onNext,
}: NewProjectViewProps) {
  return (
    // MainLayout의 Outlet 위치에 렌더링됩니다.
    // 기존의 Header, Footer, SideSheet 관련 코드는 제거되었습니다.
    <main className="flex-1 w-full flex flex-col items-center pt-44 pb-24 gap-14 z-0">
      
      {/* Title: 새 프로젝트 */}
      <div className="w-228 flex justify-start">
        <h2 className="text-h2-ko text-grayscale-black">
          새 프로젝트
        </h2>
      </div>

      {/* Form Container */}
      <div className="w-228 px-3 flex flex-col items-start gap-6">
        
        {/* 2-1. 프로젝트명 입력 */}
        <section className="self-stretch flex flex-col items-start gap-3">
          <label className="text-h3-ko text-grayscale-black">
            프로젝트명
          </label>
          <div className="self-stretch h-12 px-5 bg-grayscale-white rounded-2xl shadow-is-100 flex items-center gap-5">
            <input 
              type="text"
              value={projectName}
              onChange={onProjectNameChange}
              className="flex-1 bg-transparent border-none outline-none text-h4-ko text-grayscale-black"
            />
          </div>
        </section>

        {/* 2-2. 멤버 초대 (선택) */}
        <section className="self-stretch flex flex-col items-start gap-3">
          
          {/* Inner Wrapper for Search Input */}
          <div className="self-stretch flex flex-col items-start gap-3">
            <div className="flex items-center gap-2">
              <span className="text-h3-ko text-grayscale-black">멤버 초대</span>
              <span className="text-medium400-ko text-grayscale-black">(선택)</span>
            </div>

            {/* Search Input Field with Icon */}
            <div className="self-stretch h-12 pl-5 pr-4 bg-grayscale-white rounded-2xl shadow-is-100 flex items-center gap-5">
              <input
                type="text"
                placeholder="Github ID로 검색"
                value={memberSearchQuery}
                onChange={onMemberSearchChange}
                className="flex-1 bg-transparent border-none outline-none text-h4-ko text-grayscale-black placeholder:text-grayscale-gy600 line-clamp-1"
              />
              <div className="p-1 rounded-lg flex items-center justify-center cursor-pointer hover:bg-grayscale-gy100 transition-colors">
                <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                  <SearchIcon className="w-5 h-5 text-grayscale-black fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Invited Members List Box */}
          <div className="self-stretch h-48 p-3 bg-grayscale-gy100 rounded-2xl shadow-is-100 overflow-y-auto">
            {/* TODO: 초대된 멤버 리스트 아이템 렌더링 */}
          </div>

        </section>

      </div>

      {/* Floating Action Button (Next) */}
      <div className="fixed bottom-14 right-14 z-10">
        <FloatingBtn 
          onClick={onNext} 
          disabled={!canProceed}
        >
          다음
        </FloatingBtn>
      </div>
    </main>
  );
}