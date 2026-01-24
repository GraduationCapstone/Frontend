import type { ChangeEvent } from 'react';
import FloatingBtn from '../../components/common/FloatingBtn';
import InputField from '../../components/common/InputField';
import { ListButton } from '../../components/common/ListButton/ListButton';
import Chip from '../../components/common/Chip/Chip';
import type { User } from './NewProjectModel';

interface NewProjectViewProps {
  projectName: string;
  memberSearchQuery: string;
  searchResults: User[];
  invitedMembers: User[];
  canProceed: boolean;
  onProjectNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMemberSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectUser: (user: User) => void;
  onRemoveInvitedUser: (user: User) => void;
  onNext: () => void;
}

export default function NewProjectView({
  projectName,
  memberSearchQuery,
  searchResults,
  invitedMembers,
  canProceed,
  onProjectNameChange,
  onMemberSearchChange,
  onSelectUser,
  onRemoveInvitedUser,
  onNext,
}: NewProjectViewProps) {

  const isSearching = memberSearchQuery.length > 0;

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
          <div className="self-stretch">
            {/* [Refactor] 돋보기 아이콘 숨김 (showIcon={false}) */}
            <InputField 
              placeholder="프로젝트명을 입력하세요"
              value={projectName}
              onChange={onProjectNameChange}
              showIcon={false} 
              widthClass="w-full"
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
            <div className="self-stretch">
              <InputField
                placeholder="Github ID로 검색"
                value={memberSearchQuery}
                onChange={onMemberSearchChange}
                // showIcon={true} // 기본값이 true라면 생략 가능
                widthClass="w-full"
              />
            </div>
          </div>

          {/* 2-2. 리스트 영역 */}
          {isSearching ? (
            // [수정됨] 디자인 요구사항(그림자) 적용 + 짤림 방지 패딩 유지
            <div className={`
                self-stretch h-48 
                bg-grayscale-white 
                rounded-2xl 
                overflow-hidden 
                border border-grayscale-black/10
            `}>
              {/* 스크롤 영역 (스크롤바 숨김 유지) */}
              <div className="w-full h-full flex flex-col items-start overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <ListButton
                      key={user.id}
                      variant="dynamicWhiteMImgTextIcon"
                      label={user.name}
                      leading={{
                        type: "avatar",
                        fallbackText: user.name.charAt(0).toUpperCase(),
                      }}
                      trailing={{ type: "none" }}
                      onClick={() => onSelectUser(user)}
                      className="self-stretch"
                    />
                  ))
                ) : (
                  <div className="self-stretch h-full flex items-center justify-center text-grayscale-gy600 text-small500-ko">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </div>
          ) : (
            // --- [초대된 멤버 리스트 (기본)] ---
            <div className="self-stretch h-48 p-3 bg-grayscale-gy100 rounded-2xl shadow-is-100 overflow-y-auto">
               {/* 초대된 멤버 리스트 */}
               <div className="flex flex-wrap content-start gap-4">
                 {invitedMembers && invitedMembers.length > 0 && invitedMembers.map((user) => (
                   <Chip
                     key={user.id}
                     label={user.name}
                     avatarText={user.name.charAt(0).toUpperCase()}
                     // Chip의 클릭 이벤트가 곧 삭제 버튼 역할 (Chip 컴포넌트 구조상 전체가 버튼)
                     onClick={() => onRemoveInvitedUser(user)}
                   />
                 ))}
               </div>
            </div>
          )}

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