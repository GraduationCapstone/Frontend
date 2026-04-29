import { forwardRef, useState } from 'react';
import moreIcon from '../../../assets/icons/kebab.svg';
import StatusBadge, { type StatusBadgeType } from '../StatusBadge';

export interface TestCodeListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  codeId: string;
  title: string;
  status: StatusBadgeType;
  duration?: string;
  user?: string;
  userProfileImageUrl?: string;
  /** 예: "2025-09-09 15:34" (공백으로 날짜/시간 구분) */
  date?: string;
  disabled?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onMenuClick?: (e: React.MouseEvent) => void;
}

const TestCodeListItem = forwardRef<HTMLDivElement, TestCodeListItemProps>(
  (
    {
      codeId,
      title,
      status,
      duration,
      user,
      userProfileImageUrl,
      date,
      disabled = false,
      selected,
      onSelectChange,
      className,
      onClick,
      onMenuClick,
      ...rest
    },
    ref
  ) => {
    // ... (상태 관리 로직 동일)
    const [internalSelected, setInternalSelected] = useState(false);
    const isControlled = selected !== undefined;
    const isSelected = isControlled ? selected : internalSelected;

    const handleToggle = () => {
      if (disabled) return;
      const nextValue = !isSelected;
      if (!isControlled) setInternalSelected(nextValue);
      onSelectChange?.(nextValue);
    };

    const fullStatusMap: Record<StatusBadgeType, StatusBadgeType> = {
      pass: 'pass',
      passShort: 'pass',
      block: 'block',
      blockShort: 'block',
      fail: 'fail',
      failShort: 'fail',
      untest: 'untest',
      untestShort: 'untest',
    };

    const badgeType = fullStatusMap[status];
    const isUntest = badgeType === 'untest';

    const mainTextColor = disabled
      ? 'text-system-deactive'
      : isSelected
        ? 'text-primary-sg600'
        : 'text-grayscale-black';

    const subTextColor = disabled ? 'text-system-deactive' : 'text-grayscale-black';

    // 📅 날짜/시간 분리 로직
    const datePart = date ? date.split(' ')[0] : '-';
    const timePart = date ? date.split(' ')[1] : '';

    return (
      <div
        ref={ref}
        role="button"
        aria-disabled={disabled}
        aria-selected={isSelected}
        onClick={(e) => {
          if (!disabled) {
            handleToggle();
            onClick?.(e);
          }
        }}
        className={`group gap-m px-gap-s py-gap-s border-grayscale-gy300 bg-grayscale-white relative inline-flex w-full items-center border-b transition-colors duration-200 ${!disabled && 'hover:bg-grayscale-gy100 active:bg-grayscale-gy200'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className || ''} `}
        {...rest}
      >
        {/* 1. ID */}
        <div className="w-layout-column-unit flex items-center justify-start gap-2.5 px-2">
          <span className={`text-medium500-ko ${mainTextColor}`}>{codeId}</span>
        </div>

        {/* 2. Title */}
        <div className="flex flex-1 items-center justify-center gap-2.5 px-2">
          <span className={`text-h3-ko line-clamp-1 flex-1 ${mainTextColor}`}>{title}</span>
        </div>

        {/* 3. Status */}
        <div className="w-size-min inline-flex flex-col items-start justify-start gap-2.5 px-2">
          <StatusBadge type={badgeType} />
        </div>

        {/* 4. Duration */}
        <div className="w-size-min flex items-center justify-start gap-2.5 overflow-hidden px-2">
          <span className={`text-medium500-ko line-clamp-1 flex-1 ${subTextColor} text-center`}>
            {isUntest ? '-' : duration}
          </span>
        </div>

        {/* 5. User */}
        <div className="w-size-min flex items-center justify-start gap-2 overflow-hidden px-2">
          {!isUntest && (
            <div className="bg-primary-sg600 relative flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
              {userProfileImageUrl ? (
                <img
                  src={userProfileImageUrl}
                  alt={`${user ?? 'tester'} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-grayscale-white mt-px text-[10px] leading-none font-bold">
                  U
                </span>
              )}
            </div>
          )}
          <span
            className={`text-medium500-ko line-clamp-1 flex-1 ${subTextColor} ${isUntest ? 'text-center' : 'text-left'}`}
          >
            {isUntest ? '-' : user}
          </span>
        </div>

        {/* 6. Date Column (수정됨: 옆으로 배치) */}
        <div className="flex w-xs items-center justify-start gap-2 overflow-hidden px-2">
          {/* Untest일 경우 하이픈 하나만 중앙 정렬 */}
          {isUntest ? (
            <span className={`text-medium500-ko line-clamp-1 flex-1 ${subTextColor} text-center`}>
              -
            </span>
          ) : (
            <>
              {/* 날짜 */}
              <span className={`text-medium500-ko ${subTextColor}`}>{datePart}</span>
              {/* 시간 (gap-2로 떨어져서 표시됨) */}
              {timePart && (
                <span className={`text-medium500-ko line-clamp-1 flex-1 ${subTextColor}`}>
                  {timePart}
                </span>
              )}
            </>
          )}
        </div>

        {/* 7. Action Icon */}
        <div
          className="hover:bg-grayscale-gy100 flex items-center justify-start gap-2 rounded-lg p-1 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
        >
          <div className="relative flex h-6 w-6 items-center justify-center overflow-hidden">
            <img src={moreIcon} alt="menu" className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  }
);

TestCodeListItem.displayName = 'TestCodeListItem';
export default TestCodeListItem;
