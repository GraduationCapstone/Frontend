import type React from "react";
import type { TestCodeItem } from "../../TEDashBoard/types";

import TestListItem from "../../../components/common/ListItem/TestListItem";

type Props = {
  item: TestCodeItem;
  onOpenDashboard?: (item: TestCodeItem) => void;
  onOpenRowMenu: (id: string, e: React.MouseEvent<HTMLElement>) => void;
};

export default function ProjectTestRow({ item, onOpenDashboard, onOpenRowMenu }: Props) {
  return (
    <TestListItem
      testId={item.codeId}
      title={item.title}
      coverage={item.passRatio}
      duration={item.duration}
      user={item.user}
      date={item.date}
      status="Default"
      selected={false}
      onClick={() => onOpenDashboard?.(item)}
      onMenuClick={(e) => onOpenRowMenu(item.id, e as unknown as React.MouseEvent<HTMLElement>)}
      className="gap-5"
    />
  );
}
