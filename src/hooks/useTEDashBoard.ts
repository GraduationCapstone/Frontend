import type React from "react";
import { useMemo, useState } from "react";
import type { SortKey, TestCodeItem } from "../pages/TEDashBoard/types";

export type MenuState =
  | { kind: "none" }
  | { kind: "sort"; key: SortKey; anchorEl: HTMLElement }
  | { kind: "row"; id: string; anchorEl: HTMLElement };

type SortOrder = "asc" | "desc";

type ActiveSort =
  | { key: null; order: SortOrder }
  | { key: SortKey; order: SortOrder };

const compare = (a: string, b: string, order: SortOrder) => {
  if (a === b) return 0;
  if (order === "asc") return a < b ? -1 : 1;
  return a > b ? -1 : 1;
};

const getSortValue = (it: TestCodeItem, key: SortKey): string => {

  switch (key) {
    case "codeId":
      return it.codeId ?? "";
    case "title":
      return it.title ?? "";
    case "status":
      return it.status ?? "";
    case "duration":
      return it.duration ?? "";
    case "user":
      return it.user ?? "";
    case "date":
      return it.date ?? "";
    default:
      return "";
  }
};

export default function useTEDashBoard(list: TestCodeItem[], initialTitle: string) {
  // title edit
  const [title, setTitle] = useState(initialTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(initialTitle);

  const startEditTitle = () => {
    setDraftTitle(title);
    setIsEditingTitle(true);
  };
  const saveTitle = () => {
    const next = draftTitle.trim();
    if (next.length > 0) setTitle(next);
    setIsEditingTitle(false);
  };
  const cancelTitle = () => {
    setDraftTitle(title);
    setIsEditingTitle(false);
  };

  // split / selection
  const [isSplit, setIsSplit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = useMemo(() => {
    if (!selectedId) return null;
    return list.find((it) => it.id === selectedId) ?? null;
  }, [list, selectedId]);

  const selectItem = (id: string | null) => setSelectedId(id);

  // menu
  const [menu, setMenu] = useState<MenuState>({ kind: "none" });

  const openSortMenu = (key: SortKey, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenu({ kind: "sort", key, anchorEl: e.currentTarget });
  };
  const openRowMenu = (id: string, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenu({ kind: "row", id, anchorEl: e.currentTarget });
  };
  const closeMenu = () => setMenu({ kind: "none" });
  
  const [activeSort, setActiveSort] = useState<ActiveSort>({ key: null, order: "asc" });

  const applySort = (key: SortKey, order: SortOrder) => {
    setActiveSort({ key, order });
    closeMenu();
  };

  const sortedList = useMemo(() => {
    if (activeSort.key === null) return list;

    const key = activeSort.key;
    const order = activeSort.order;

    return [...list].sort((a, b) => {
      const va = getSortValue(a, key);
      const vb = getSortValue(b, key);
      return compare(va, vb, order);
    });
  }, [list, activeSort]);

  // 모달
  const [editModalId, setEditModalId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const openEditModal = (id: string) => setEditModalId(id);
  const openDeleteModal = (id: string) => setDeleteModalId(id);
  const closeModals = () => {
    setEditModalId(null);
    setDeleteModalId(null);
  };

  return {
    // title
    title,
    isEditingTitle,
    draftTitle,
    setDraftTitle,
    startEditTitle,
    saveTitle,
    cancelTitle,

    // {split/selection}
    isSplit,
    setIsSplit,
    selectedId,
    selectedItem,
    selectItem,

    sortedList,

    menu,
    openSortMenu,
    openRowMenu,
    closeMenu,
    sortKey: activeSort.key,
    sortOrder: activeSort.order,
    applySort,

    // 모달
    editModalId,
    deleteModalId,
    openEditModal,
    openDeleteModal,
    closeModals,
  };
}

export type TEDashBoardState = ReturnType<typeof useTEDashBoard>;