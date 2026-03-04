import { useEffect, useMemo, useState } from "react";
import useTEDashBoard from "../../../hooks/useTEDashBoard";
import type { TestCodeItem } from "../../TEDashBoard/types";

import ProjectTestsTableHeader from "./ProjectTestsTableHeader";
import ProjectTestRow from "./ProjectTestRow";
import PopoverMenu from "./PopoverMenu";

import EditTestCodeModal from "../../../components/common/Modal/EditTestCodeModal";
import DeleteTestCodeModal from "../../../components/common/Modal/DeleteTestCodeModal";

type Props = {
  title: string;
  tests: TestCodeItem[];
};

export default function ProjectTestsPanel({ title, tests }: Props) {
  const [list, setList] = useState<TestCodeItem[]>(tests);

  // 상위에서 tests가 바뀌면 동기화
  useEffect(() => {
    setList(tests);
  }, [tests]);

  const table = useTEDashBoard(list, "");

  const editingItem = useMemo(() => {
    if (!table.editModalId) return null;
    return table.sortedList.find((it) => it.id === table.editModalId) ?? null;
  }, [table.editModalId, table.sortedList]);

  const deletingItem = useMemo(() => {
    if (!table.deleteModalId) return null;
    return table.sortedList.find((it) => it.id === table.deleteModalId) ?? null;
  }, [table.deleteModalId, table.sortedList]);

  return (
    <div className="w-size-max flex flex-col justify-start items-start gap-5">
      <div className="self-stretch text-h4-ko text-grayscale-black">{title}</div>

      <div className="w-full rounded-tl-lg rounded-tr-lg outline-1 outline-grayscale-gy200 overflow-hidden">
        <ProjectTestsTableHeader
          onOpenSortMenu={table.openSortMenu}
          activeSortKey={table.sortKey}
          activeSortOrder={table.sortOrder}
        />

        <div className="flex flex-col">
          {table.sortedList.map((it) => (
            <ProjectTestRow key={it.id} item={it} onOpenRowMenu={table.openRowMenu} />
          ))}
        </div>
      </div>

      <PopoverMenu
        menu={table.menu}
        onClose={table.closeMenu}
        activeSortKey={table.sortKey}
        activeSortOrder={table.sortOrder}
        onApplySort={table.applySort}
        onEdit={(id) => table.openEditModal(id)}
        onDelete={(id) => table.openDeleteModal(id)}
      />

      <EditTestCodeModal
        open={table.editModalId !== null}
        title={editingItem?.title ?? ""}
        onClose={table.closeModals}
        onConfirm={(nextTitle) => {
          const id = table.editModalId;
          if (!id) return;

          const t = (nextTitle ?? "").trim();
          if (t.length === 0) return;

          setList((prev) => prev.map((it) => (it.id === id ? { ...it, title: t } : it)));

          table.closeModals();
        }}
      />

      <DeleteTestCodeModal
        open={table.deleteModalId !== null}
        title={deletingItem?.title ?? ""}
        onClose={table.closeModals}
        onConfirm={() => {
          const id = table.deleteModalId;
          if (!id) return;

          setList((prev) => prev.filter((it) => it.id !== id));

          table.closeModals();
        }}
      />
    </div>
  );
}