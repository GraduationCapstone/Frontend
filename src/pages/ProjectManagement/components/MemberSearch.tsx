import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import type { Member } from "../types";
import MemberChip from "./MemberChip";

import InputField from "../../../components/common/InputField";
import { ListButton } from "../../../components/common/ListButton";

type Props = {
  allCandidates: Member[];
  selected: Member[];
  onChangeSelected: (next: Member[]) => void;
};

export default function MemberSearch({ allCandidates, selected, onChangeSelected }: Props) {
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const isSearching = query.length > 0;

  const searchResults = useMemo(() => {
    if (!query) return [];

    return allCandidates
      .filter((m) => m.username.toLowerCase().includes(query))
      .filter((m) => !selected.some((s) => s.id === m.id))
      .slice(0, 8);
  }, [query, allCandidates, selected]);

  const add = (m: Member) => {
    onChangeSelected([...selected, m]);
    setQ(""); // 추가 후 검색 종료 → 칩 리스트로 복귀
  };

  const remove = (id: string) => {
    onChangeSelected(selected.filter((m) => m.id !== id));
  };

  return (
    <div className="self-stretch flex flex-col items-start gap-3">
      <div className="self-stretch">
        <InputField
          value={q}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
          placeholder="Github ID로 검색"
        />
      </div>

      {/* 검색 중이면 검색결과 패널 / 아니면 초대된 멤버 칩 패널 */}
      {isSearching ? (
        <div className="self-stretch h-48 bg-grayscale-white rounded-2xl overflow-hidden border border-grayscale-black/10 shadow-ds-200">
          <div className="w-full h-full flex flex-col items-start overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden">
            {searchResults.length > 0 ? (
              searchResults.map((m) => (
                <ListButton
                key={m.id}
                variant="dynamicWhiteMImgTextIcon"
                label={m.username}
                leading={{
                  type: "avatar",
                  fallbackText: m.username.charAt(0).toUpperCase(),}}
                trailing={{ type: "none" }}
                onClick={() => add(m)}
                className="self-stretch"
                />
              ))
            ) : (
              <div className="self-stretch h-full flex items-center justify-center text-grayscale-gy600 text-small500-ko">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="self-stretch h-48 p-3 bg-grayscale-gy100 rounded-2xl shadow-is-100 overflow-y-auto">
          <div className="flex flex-wrap content-start gap-4">
            {selected.length > 0 ? (
              selected.map((m) => (
                <MemberChip key={m.id} member={m} onRemove={() => remove(m.id)} />
              ))
            ) : (
              <div className="w-full h-full min-h-[168px] flex items-center justify-center text-grayscale-gy600 text-small500-ko">
                초대된 멤버가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}