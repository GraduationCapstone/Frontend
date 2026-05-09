import type React from 'react';
import type { TestCodeItem, SortKey } from '../types';
import type { MenuState } from '../../../hooks/useTEDashBoard';

import TestCodeListItem from '../../../components/common/ListItem/TestCodeListItem';
import TestCodeListItemSimple from '../../../components/common/ListItem/TestCodeListItemSimple';
import type { StatusBadgeType } from '../../../components/common/StatusBadge';
import TestCodeTableHeader, { SimpleTableHeader } from './TestCodeTableHeader';
import PopoverMenu from './PopoverMenu';
import EditModal from '../../../components/common/Modal/EditTestCodeModal';
import DeleteModal from '../../../components/common/Modal/DeleteTestCodeModal';

type Props = {
  variant?: 'full' | 'simple';

  totalCount: number;

  selectedId: string | null;
  list: TestCodeItem[];

  menu: MenuState;
  sortKey: SortKey | null;
  sortOrder: 'asc' | 'desc';

  onSelect: (id: string | null) => void;

  onOpenSortMenu: (key: SortKey, e: React.MouseEvent<HTMLElement>) => void;
  onApplySort: (key: SortKey, order: 'asc' | 'desc') => void;

  onOpenRowMenu: (id: string, e: React.MouseEvent<HTMLElement>) => void;
  onCloseMenu: () => void;

  editModalId: string | null;
  deleteModalId: string | null;
  onOpenEditModal: (id: string) => void;
  onOpenDeleteModal: (id: string) => void;
  onCloseModals: () => void;
  onSaveTestCodeTitle: (id: string, title: string) => void | Promise<void>;
  onDeleteTestCode: (id: string) => void | Promise<void>;
};

const toStatusBadgeType = (
  status: TestCodeItem['status'],
  variant: 'full' | 'short' = 'full'
): StatusBadgeType => {
  const short = variant === 'short';

  switch (status) {
    case 'Pass':
      return short ? 'passShort' : 'pass';
    case 'Block':
      return short ? 'blockShort' : 'block';
    case 'Fail':
      return short ? 'failShort' : 'fail';
    case 'Untest':
    default:
      return short ? 'untestShort' : 'untest';
  }
};

export default function TestCodeSection({
  variant = 'full',
  totalCount,
  selectedId,
  list,
  menu,
  sortKey,
  sortOrder,
  onSelect,
  onOpenSortMenu,
  onApplySort,
  onOpenRowMenu,
  onCloseMenu,
  editModalId,
  deleteModalId,
  onOpenEditModal,
  onOpenDeleteModal,
  onCloseModals,
  onSaveTestCodeTitle,
  onDeleteTestCode,
}: Props) {
  const isSimple = variant === 'simple';
  const safeSelect = (id: string | null) => {
    if (typeof onSelect === 'function') onSelect(id);
  };
  const editingItem = editModalId ? (list.find((it) => it.id === editModalId) ?? null) : null;
  const deletingItem = deleteModalId ? (list.find((it) => it.id === deleteModalId) ?? null) : null;

  return (
    <section className="max-w-size-max inline-flex w-full flex-col items-start justify-start gap-5">
      <div className="text-h4-ko text-grayscale-black justify-center self-stretch">
        {totalCount} 테스트 코드
      </div>

      <div className="w-full">
        <div className="outline-grayscale-gy300 flex flex-col items-start justify-start self-stretch overflow-hidden rounded-lg outline-1">
          {isSimple ? (
            <SimpleTableHeader onOpenSortMenu={onOpenSortMenu} />
          ) : (
            <TestCodeTableHeader onOpenSortMenu={onOpenSortMenu} />
          )}

          <div className="flex flex-col self-stretch">
            {list.map((it) => {
              const isSelected = selectedId === it.id;
              const statusType = toStatusBadgeType(it.status, isSimple ? 'short' : 'full');

              const handleSelectChange = (next: boolean) => {
                safeSelect(next ? it.id : null);
              };

              return isSimple ? (
                <TestCodeListItemSimple
                  key={it.id}
                  codeId={it.codeId}
                  title={it.title}
                  status={statusType}
                  duration={it.duration}
                  selected={isSelected}
                  onSelectChange={handleSelectChange}
                  onMenuClick={(e) => onOpenRowMenu(it.id, e as React.MouseEvent<HTMLElement>)}
                />
              ) : (
                <TestCodeListItem
                  key={it.id}
                  codeId={it.codeId}
                  title={it.title}
                  status={statusType}
                  duration={it.duration}
                  user={it.user}
                  date={it.date}
                  selected={isSelected}
                  onSelectChange={handleSelectChange}
                  onMenuClick={(e) => onOpenRowMenu(it.id, e as React.MouseEvent<HTMLElement>)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <PopoverMenu
        menu={menu}
        onClose={onCloseMenu}
        activeSortKey={sortKey}
        activeSortOrder={sortOrder}
        onApplySort={onApplySort}
        onEdit={(id) => onOpenEditModal(id)}
        onDelete={(id) => onOpenDeleteModal(id)}
      />

      {editModalId && (
        <EditModal
          open
          title={editingItem?.title ?? ''}
          onClose={onCloseModals}
          onConfirm={(nextTitle) => {
            const id = editModalId;
            const title = nextTitle?.trim() ?? '';
            if (!id || title.length === 0) return;

            Promise.resolve(onSaveTestCodeTitle(id, title))
              .then(onCloseModals)
              .catch((error) => {
                console.error('[TEDashBoard] 테스트 코드명 수정 실패:', error);
              });
          }}
        />
      )}
      {deleteModalId && (
        <DeleteModal
          open
          title={deletingItem?.title ?? ''}
          onClose={onCloseModals}
          onConfirm={() => {
            const id = deleteModalId;
            if (!id) return;

            Promise.resolve(onDeleteTestCode(id))
              .then(() => {
                onSelect(null);
                onCloseModals();
              })
              .catch((error) => {
                console.error('[TEDashBoard] 테스트 코드 삭제 실패:', error);
              });
          }}
        />
      )}
    </section>
  );
}
