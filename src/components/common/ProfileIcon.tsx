// src/components/common/ProfileIcon.tsx

interface ProfileIconProps {
  isActive?: boolean;
  initial?: string; // 예전 글자(Fallback)
  src?: string;     // ✨ [추가] 진짜 이미지 URL
  className?: string;
  //size?: 'sm' | 'md' | 'lg'; 사이즈 조절(선택)
}

export default function ProfileIcon({ 
  isActive = false, 
  initial = 'U', 
  src,
  className
}: ProfileIconProps) {

  const sizeClass = 'w-10 h-10';

  const baseClasses = [
    sizeClass,
    "rounded-full flex items-center justify-center overflow-hidden shrink-0", // overflow-hidden 필수!
    isActive ? "bg-primary-p300" : "bg-grayscale-gy200",
    className,
  ].join(" ");

  // ✨ [핵심 로직] 이미지가 넘어왔다면 <img> 태그를 렌더링합니다.
  if (src) {
    return (
      <div className={baseClasses}>
        <img 
          src={src} 
          alt="profile" 
          className="w-full h-full object-cover" // 이미지가 꽉 차게
          // 이미지 로드 실패 시 글자(Fallback)로 보여주는 안전장치 추가하면 완벽합니다.
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'; // 이미지 숨김
            // 부모 div에 글자가 나타나게 처리하는 로직이 필요하지만, 
            // 일단은 컴포넌트를 간단히 유지하기 위해 onError 처리만 해둡니다.
          }}
        />
      </div>
    );
  }

  // ✨ 이미지가 없으면 예전처럼 글자(initial) 또는 아이콘을 렌더링합니다.
  return (
    <div className={baseClasses}>
      <span className={`${isActive ? "text-grayscale-white" : "text-grayscale-gy600"} text-h4-ko`}>
        {initial}
      </span>
    </div>
  );
}