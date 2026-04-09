import { useMemo } from "react";
import { getTEDashBoardData } from "./TEDashBoardModel";
import useTEDashBoard from "../../hooks/useTEDashBoard";
import TEDashBoardView from "./TEDashBoardView";

export default function TEDashBoardController() {
  const data = useMemo(() => {
    // TODO: 백엔드 연동 후 실제 prefix 값을 여기로 전달
    const backendTestCodePrefix: string | undefined = undefined;
    return getTEDashBoardData({ testCodePrefix: backendTestCodePrefix });
  }, []);
  const state = useTEDashBoard(data.list, data.projectTitle);

  return <TEDashBoardView data={data} state={state} />;
}
