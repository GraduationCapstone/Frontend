import type { Member } from "../types";
import { Btn_Dynamic_GY100_XS_IMG_Text_Icon } from "../../../components/common/Chip/Chip";

type Props = {
  member: Member;
  onRemove: () => void;
};

export default function MemberChip({ member, onRemove }: Props) {
  return (
    <Btn_Dynamic_GY100_XS_IMG_Text_Icon
      label={member.username}
      avatarText={member.username[0]?.toUpperCase() ?? "U"}
      onRemove={onRemove}
    />
  );
}
