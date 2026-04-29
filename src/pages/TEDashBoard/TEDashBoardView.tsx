import type { TEDashBoardData } from './types';
import type { TEDashBoardState } from '../../hooks/useTEDashBoard';

import HeaderFrame from './components/HeaderFrame';
import GraphFrame from './components/GraphFrame';
import TestCodeSection from './components/TestCodeSection';
import DetailSection from './components/DetailSection';

type Props = {
  data: TEDashBoardData;
  state: TEDashBoardState;
  onDownloadTestPlan: () => void;
  onDownloadTestReport: () => void;
};

export default function TEDashBoardView({
  data,
  state,
  onDownloadTestPlan,
  onDownloadTestReport,
}: Props) {
  const isSplit = state.selectedId !== null;

  const selectedItem = isSplit
    ? (state.sortedList.find((it) => it.id === state.selectedId) ?? null)
    : null;

  return (
    <main className="inline-flex flex-col items-center justify-start self-stretch pt-20">
      {/* split 컨테이너 */}
      <div
        className={[
          'min-h-[63rem] w-full',
          isSplit ? 'flex items-start gap-10' : 'px-layout-margin flex flex-col items-center',
        ].join(' ')}
      >
        <div
          className={[
            'flex flex-col items-center',
            isSplit ? 'px-layout-margin min-w-0 flex-1 gap-10 self-stretch' : 'w-full',
          ].join(' ')}
        >
          <HeaderFrame
            title={state.title}
            isEditingTitle={state.isEditingTitle}
            draftTitle={state.draftTitle}
            setDraftTitle={state.setDraftTitle}
            onStartEditTitle={state.startEditTitle}
            onSaveTitle={state.saveTitle}
            onCancelTitle={state.cancelTitle}
            onDownloadTestPlan={onDownloadTestPlan}
            onDownloadTestReport={onDownloadTestReport}
          />

          <GraphFrame
            summary={data.summary}
            totalCount={data.totalCount}
            testedCount={data.testedCount}
          />

          <TestCodeSection
            variant={isSplit ? 'simple' : 'full'}
            totalCount={data.totalCount}
            selectedId={state.selectedId}
            list={state.sortedList}
            menu={state.menu}
            sortKey={state.sortKey}
            sortOrder={state.sortOrder}
            onSelect={(id) => {
              if (typeof state.selectItem === 'function') {
                state.selectItem(id);
                return;
              }
              console.error('state.selectItem이 함수가 아님:', state.selectItem, state);
            }}
            onOpenSortMenu={state.openSortMenu}
            onApplySort={state.applySort}
            onOpenRowMenu={state.openRowMenu}
            onCloseMenu={state.closeMenu}
            editModalId={state.editModalId}
            deleteModalId={state.deleteModalId}
            onOpenEditModal={state.openEditModal}
            onOpenDeleteModal={state.openDeleteModal}
            onCloseModals={state.closeModals}
          />
        </div>
        {isSplit && selectedItem && (
          <DetailSection item={selectedItem} onClose={() => state.selectItem(null)} />
        )}
      </div>
    </main>
  );
}
