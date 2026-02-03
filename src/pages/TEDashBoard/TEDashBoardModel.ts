import type { TEDashBoardData, TestCodeItem } from "./types";

const makeStatuses = (): TestCodeItem["status"][] => {
  const total = 50;
  const statuses: TestCodeItem["status"][] = Array.from(
    { length: total },
    () => "Pass" as const
  );

  const untestIdx = [5, 22, 41];
  const failIdx = [13, 33];
  const blockIdx = [27];

  untestIdx.forEach((i) => (statuses[i] = "Untest"));
  failIdx.forEach((i) => (statuses[i] = "Fail"));
  blockIdx.forEach((i) => (statuses[i] = "Block"));

  return statuses;
};

const mockList = (): TestCodeItem[] => {
  const statuses = makeStatuses();

  return statuses.map((status, i) => {
    const idx = i + 1;

    const day = String((idx % 28) + 1).padStart(2, "0");
    const hour = String((9 + idx) % 24).padStart(2, "0");
    const minute = String((10 + idx * 3) % 60).padStart(2, "0");

    return {
      id: `row-${idx}`,
      codeId: `C${String(idx).padStart(4, "0")}`,
      title: `test_code_${idx}`,
      status,
      duration: status === "Untest" ? undefined : `${30 + (idx % 90)}s`,
      user: status === "Untest" ? undefined : `User${(idx % 9) + 1}`,
      date: status === "Untest" ? undefined : `2025-09-${day} ${hour}:${minute}`,
    };
  });
};

export const getTEDashBoardData = (): TEDashBoardData => {
  const list = mockList();

  const summary = list.reduce(
    (acc, it) => {
      if (it.status === "Pass") acc.pass += 1;
      if (it.status === "Block") acc.block += 1;
      if (it.status === "Fail") acc.fail += 1;
      if (it.status === "Untest") acc.untest += 1;
      return acc;
    },
    { pass: 0, block: 0, fail: 0, untest: 0 }
  );

  const totalCount = list.length;
  const testedCount = totalCount - summary.untest;

  return {
    projectTitle: "Test A",
    totalCount,
    testedCount,
    summary,
    list,
  };
};
