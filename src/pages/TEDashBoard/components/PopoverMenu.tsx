import { useLayoutEffect, useRef, useState } from "react";
import type { MenuState } from "../../../hooks/useTEDashBoard";
import type { SortKey } from "../types";

import useClickOutside from "../../../hooks/useClickOutside";

import {
  DynamicWhiteSIconsTextButton,
  DynamicWhiteSIconTextButton,
} from "../../../components/common/ListButton";

import PencilIcon from "../../../assets/icons/pencil.svg?react";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import AscIcon from "../../../assets/icons/asc.svg?react";
import DescIcon from "../../../assets/icons/desc.svg?react";

type Props = {
  menu: MenuState;
  onClose: () => void;
  activeSortKey: SortKey | null;
  activeSortOrder: "asc" | "desc";
  onApplySort: (key: SortKey, order: "asc" | "desc") => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

type Pos = {
  left: number;
  top: number;
  transform: string;
  origin: string;
};

export default function PopoverMenu({
  menu,
  onClose,
  activeSortKey,
  activeSortOrder,
  onApplySort,
  onEdit,
  onDelete,
}: Props) {
  if (menu.kind === "none") return null;

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, menu.kind !== "none");

  const [pos, setPos] = useState<Pos>({
    left: 0,
    top: 0,
    transform: "translateX(-100%)",
    origin: "top right",
  });

  useLayoutEffect(() => {
    const anchor = menu.anchorEl;
    const gap = 8;
    const margin = 8;

    const r = anchor.getBoundingClientRect();

    let left = r.right;
    let top = r.bottom + gap;
    let transform = "translateX(-100%)";
    let origin = "top right";

    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;

      const mr = el.getBoundingClientRect();

      if (left - mr.width < margin) {
        left = r.left;
        transform = "translateX(0)";
        origin = "top left";
      }

      if (top + mr.height > window.innerHeight - margin) {
        top = r.top - mr.height - gap;
        origin = origin.includes("left") ? "bottom left" : "bottom right";
      }

      left = Math.min(Math.max(left, margin), window.innerWidth - margin);
      top = Math.min(Math.max(top, margin), window.innerHeight - margin);

      setPos({ left, top, transform, origin });
    });
  }, [menu]);

  const style: React.CSSProperties = {
    position: "fixed",
    left: pos.left,
    top: pos.top,
    transform: pos.transform,
    transformOrigin: pos.origin,
    zIndex: 9999,
  };

  if (menu.kind === "sort") {
    const isAscSelected = activeSortKey === menu.key && activeSortOrder === "asc";
    const isDescSelected = activeSortKey === menu.key && activeSortOrder === "desc";

    return (
      <div
        ref={ref}
        style={style}
        className="rounded-xl bg-grayscale-white shadow-ds-200 overflow-hidden w-overlay-dropdown py-3 justify-center items-start gap-0.5"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="inline-flex flex-col">
          <DynamicWhiteSIconsTextButton
            label="오름차순"
            className="self-stretch inline-flex justify-start items-center"
            selected={isAscSelected}
            icons={{ plus: AscIcon }}
            onClick={() => {
              onApplySort(menu.key, "asc");
              onClose();
            }}
          />
          <DynamicWhiteSIconsTextButton
            label="내림차순"
            className="self-stretch inline-flex justify-start items-center"
            selected={isDescSelected}
            icons={{ plus: DescIcon }}
            onClick={() => {
              onApplySort(menu.key, "desc");
              onClose();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={style}
      className="rounded-xl bg-grayscale-white shadow-ds-200 overflow-hidden w-32 py-3 justify-center items-start gap-0.5"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col">
        <DynamicWhiteSIconTextButton
          label="수정"
          className="self-stretch inline-flex justify-start items-center"
          icons={{ plus: PencilIcon }}
          onClick={() => {
            onEdit(menu.id);
            onClose();
          }}
        />
        <DynamicWhiteSIconTextButton
          label="삭제"
          className="self-stretch inline-flex justify-start items-center"
          icons={{ plus: DeleteIcon }}
          onClick={() => {
            onDelete(menu.id);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
