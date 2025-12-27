// src/pages/Home.tsx
import FloatingBtn from '../components/common/FloatingBtn';
import ProfileIcon from '../components/common/ProfileIcon';

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-grayscale-gy100">
      
      {/* 1. 활성 상태 버튼 */}
      <FloatingBtn onClick={() => alert('클릭!')}>
        Btn
      </FloatingBtn>

      {/* 2. 비활성 상태 버튼 */}
      <FloatingBtn disabled>
        Btn
      </FloatingBtn>

      {/* 1. Active 상태 (초록색) */}
        <ProfileIcon isActive={true} initial="U" />

      {/* 2. Deactive 상태 (회색) */}
      <ProfileIcon isActive={false} initial="U" />

    </div>
  );
}