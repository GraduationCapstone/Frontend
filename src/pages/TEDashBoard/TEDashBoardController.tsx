import { useMemo } from "react";
import { getTEDashBoardData } from "./TEDashBoardModel";
import useTEDashBoard from "../../hooks/useTEDashBoard";
import TEDashBoardView from "./TEDashBoardView";

export default function TEDashBoardController() {
  const data = useMemo(() => getTEDashBoardData(), []);
  const state = useTEDashBoard(data.list, data.projectTitle);

  return <TEDashBoardView data={data} state={state} />;
}
