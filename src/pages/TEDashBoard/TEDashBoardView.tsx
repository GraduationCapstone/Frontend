import type { TEDashBoardData } from "./types";
import type { TEDashBoardState } from "../../hooks/useTEDashBoard";

import HeaderFrame from "./components/HeaderFrame";
import GraphFrame from "./components/GraphFrame";
import TestCodeSection from "./components/TestCodeSection";
import DetailSection from "./components/DetailSection";

type Props = {
  data: TEDashBoardData;
  state: TEDashBoardState;
};

export default function TEDashBoardView({ data, state }: Props) {
  const isSplit = state.selectedId !== null;

  const selectedItem = isSplit
    ? state.sortedList.find((it) => it.id === state.selectedId) ?? null
    : null;

  return (
    <main className="self-stretch inline-flex flex-col items-center justify-start pt-20">
      {/* split 컨테이너 */}
      <div
        className={[
          "w-full min-h-[63rem]",
          isSplit ? "flex items-start gap-10" : "px-layout-margin flex flex-col items-center ",
        ].join(" ")}
      >
        <div
          className={[
            "flex flex-col items-center",
            isSplit ? "flex-1 min-w-0 self-stretch px-layout-margin gap-10" : " w-full",
          ].join(" ")}
        >
          <HeaderFrame
            title={state.title}
            isEditingTitle={state.isEditingTitle}
            draftTitle={state.draftTitle}
            setDraftTitle={state.setDraftTitle}
            onStartEditTitle={state.startEditTitle}
            onSaveTitle={state.saveTitle}
            onCancelTitle={state.cancelTitle}
          />

          <GraphFrame
            summary={data.summary}
            totalCount={data.totalCount}
            testedCount={data.testedCount}
          />

          <TestCodeSection
          variant={isSplit ? "simple" : "full"}
            totalCount={data.totalCount}
            selectedId={state.selectedId}
            list={state.sortedList}
            menu={state.menu}
            sortKey={state.sortKey}
            sortOrder={state.sortOrder}
            onSelect={(id) => {
              if (typeof state.selectItem === "function") {
                state.selectItem(id);
                return;
              }
              console.error("state.selectItem이 함수가 아님:", state.selectItem, state);
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
          <DetailSection
            projectTitle={state.title}
            item={selectedItem}
            onClose={() => state.selectItem(null)}
          />
        )}
      </div>
    </main>
  );
}
