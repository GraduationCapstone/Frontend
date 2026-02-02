import type { TEDashBoardData } from "./types";
import type { ReturnType } from "./utils";
import HeaderFrame from "./components/HeaderFrame";
import GraphFrame from "./components/GraphFrame";
import TestCodeSection from "./components/TestCodeSection";

type Props = {
  data: TEDashBoardData;
  state: ReturnType;
};

export default function TEDashBoardView({ data, state }: Props) {
  return (
    <main className="self-stretch w-full min-h-[63rem] inline-flex flex-col items-center justify-start px-layout-margin pb-24 pt-24 gap-10">
      <HeaderFrame
        title={state.title}
        isEditingTitle={state.isEditingTitle}
        draftTitle={state.draftTitle}
        setDraftTitle={state.setDraftTitle}
        onStartEditTitle={state.startEditTitle}
        onSaveTitle={state.saveTitle}
        onCancelTitle={state.cancelTitle}
      />

      <GraphFrame summary={data.summary} totalCount={data.totalCount} testedCount={data.testedCount} />

      <TestCodeSection
        totalCount={data.totalCount}
        selectedId={state.selectedId}
        list={state.sortedList}
        menu={state.menu}
        sortKey={state.sortKey}
        sortOrder={state.sortOrder}
        onSelect={state.selectItem}
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
    </main>
  );
}
