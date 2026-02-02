import type { SortKey } from "../types";
import SelectTrigger from "../../../components/common/TriggerButton/SelectTrigger";

type Props = {
  onOpenSortMenu: (key: SortKey, e: React.MouseEvent<HTMLElement>) => void;
};

export default function TestCodeTableHeader({ onOpenSortMenu }: Props) {
  return (
    <div className="self-stretch w-full pl-4 pr-16 py-1 bg-grayscale-gy200 flex justify-start items-center gap-5">
      <SelectTrigger
        label="ID"
        widthClassName="w-layout-column-unit"
        onClick={(e) => onOpenSortMenu("codeId", e)}
      />

      <SelectTrigger
        label="테스트 코드명"
        widthClassName="flex-1 "
        onClick={(e) => onOpenSortMenu("title", e)}
      />

      <SelectTrigger
        label="상태"
        widthClassName="w-size-min"
        paddingClassName="px-3 py-2"
        onClick={(e) => onOpenSortMenu("status", e)}
      />

      <SelectTrigger
        label="테스트 시간"
        widthClassName="w-size-min"
        paddingClassName="px-3 py-2"
        onClick={(e) => onOpenSortMenu("duration", e)}
      />

      <SelectTrigger
        label="테스터"
        widthClassName="w-size-min"
        paddingClassName="px-3 py-2"
        onClick={(e) => onOpenSortMenu("user", e)}
      />

      <SelectTrigger
        label="일시"
        widthClassName="w-xs"
        paddingClassName="px-3 py-2"
        onClick={(e) => onOpenSortMenu("date", e)}
      />
    </div>
  );
}
