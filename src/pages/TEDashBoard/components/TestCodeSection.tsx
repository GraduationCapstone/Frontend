import type React from "react";
import type { TestCodeItem, SortKey } from "../types";
import type { MenuState } from "../../../hooks/useTEDashBoard";

import TestCodeListItem from "../../../components/common/ListItem/TestCodeListItem";
import TestCodeListItemSimple from "../../../components/common/ListItem/TestCodeListItemSimple";
import type { StatusBadgeType } from "../../../components/common/StatusBadge";
import TestCodeTableHeader, { SimpleTableHeader } from "./TestCodeTableHeader";
import PopoverMenu from "./PopoverMenu";
import EditModal from "../../../components/common/Modal/EditTestCodeModal";
import DeleteModal from "../../../components/common/Modal/DeleteTestCodeModal";

type Props = {
  variant?: "full" | "simple";

  totalCount: number;

  selectedId: string | null;
  list: TestCodeItem[];

  menu: MenuState;
  sortKey: SortKey | null;
  sortOrder: "asc" | "desc";

  onSelect: (id: string | null) => void;

  onOpenSortMenu: (key: SortKey, e: React.MouseEvent<HTMLElement>) => void;
  onApplySort: (key: SortKey, order: "asc" | "desc") => void;

  onOpenRowMenu: (id: string, e: React.MouseEvent<HTMLElement>) => void;
  onCloseMenu: () => void;

  editModalId: string | null;
  deleteModalId: string | null;
  onOpenEditModal: (id: string) => void;
  onOpenDeleteModal: (id: string) => void;
  onCloseModals: () => void;
};

const toStatusBadgeType = (
  status: TestCodeItem["status"],
  variant: "full" | "short" = "full"
): StatusBadgeType => {
  const short = variant === "short";

  switch (status) {
    case "Pass":
      return short ? "passShort" : "pass";
    case "Block":
      return short ? "blockShort" : "block";
    case "Fail":
      return short ? "failShort" : "fail";
    case "Untest":
    default:
      return short ? "untestShort" : "untest";
  }
};


export default function TestCodeSection({
  variant = "full",
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
}: Props) {
  const isSimple = variant === "simple";
  const safeSelect = (id: string | null) => {
    if (typeof onSelect === "function") onSelect(id);
  };

  return (
    <section className="w-full max-w-size-max inline-flex flex-col justify-start items-start gap-5">
      <div className="self-stretch justify-center text-h4-ko text-grayscale-black">
        {totalCount} 테스트 코드
      </div>

      <div className="w-full">
        <div className="self-stretch rounded-lg outline-1 outline-grayscale-gy300 flex flex-col justify-start items-start overflow-hidden">

          {isSimple ? (
            <SimpleTableHeader onOpenSortMenu={onOpenSortMenu} />
          ) : (
            <TestCodeTableHeader onOpenSortMenu={onOpenSortMenu} />
          )}

          <div className="self-stretch flex flex-col">
            {list.map((it) => {
              const isSelected = selectedId === it.id;
              const statusType = toStatusBadgeType(it.status, isSimple ? "short" : "full");

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
                  onMenuClick={(e) => onOpenRowMenu(it.id, e)}
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
                  onMenuClick={(e) => onOpenRowMenu(it.id, e)}
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

      {editModalId && <EditModal open onClose={onCloseModals} id={editModalId} />}
      {deleteModalId && <DeleteModal open onClose={onCloseModals} id={deleteModalId} />}
    </section>
  );
}
