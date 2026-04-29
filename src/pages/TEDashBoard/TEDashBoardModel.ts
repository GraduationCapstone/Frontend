import type { TEDashBoardData, TestCodeItem, TestStatus } from './types';
import type {
  TestDashboardBasicListItem,
  TestDashboardGroupResponse,
} from '../../api/testDashboard';

type GetTEDashBoardDataOptions = {
  group?: TestDashboardGroupResponse | null;
  results?: TestDashboardBasicListItem[] | null;
};

const normalizeStatus = (status: string | null): TestStatus => {
  const normalized = status?.replace(/[\s_-]/g, '').toUpperCase() ?? '';

  if (
    normalized === 'PASS' ||
    normalized === 'PASSED' ||
    normalized === 'SUCCESS' ||
    normalized === 'COMPLETED'
  ) {
    return 'Pass';
  }
  if (normalized === 'FAIL' || normalized === 'FAILED' || normalized === 'ERROR') {
    return 'Fail';
  }
  if (normalized === 'BLOCK' || normalized === 'BLOCKED') {
    return 'Block';
  }

  return 'Untest';
};

const toOptionalText = (value: string | null): string | undefined => {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
};

const formatDate = (completedAt: string | null): string | undefined => {
  const text = toOptionalText(completedAt);
  return text?.replace('T', ' ').slice(0, 16);
};

const mapResultToTestCodeItem = (
  result: TestDashboardBasicListItem,
  index: number
): TestCodeItem => {
  const id = toOptionalText(result.testCaseId) ?? `result-${index + 1}`;

  return {
    id,
    codeId: id,
    title: toOptionalText(result.testCodeName) ?? id,
    status: normalizeStatus(result.status),
    duration: toOptionalText(result.duration),
    user: toOptionalText(result.tester),
    date: formatDate(result.completedAt),
  };
};

const getList = (results?: TestDashboardBasicListItem[] | null): TestCodeItem[] =>
  (results ?? []).map((result, index) => mapResultToTestCodeItem(result, index));

const getSummary = (list: TestCodeItem[]) =>
  list.reduce(
    (acc, it) => {
      if (it.status === 'Pass') acc.pass += 1;
      if (it.status === 'Block') acc.block += 1;
      if (it.status === 'Fail') acc.fail += 1;
      if (it.status === 'Untest') acc.untest += 1;
      return acc;
    },
    { pass: 0, block: 0, fail: 0, untest: 0 }
  );

export const getTEDashBoardData = (options: GetTEDashBoardDataOptions = {}): TEDashBoardData => {
  const group = options.group;
  const list = getList(options.results);
  const summary = getSummary(list);

  const totalCount = list.length;
  const testedCount = totalCount - summary.untest;

  return {
    projectTitle: group?.groupName?.trim() ?? '',
    totalCount,
    testedCount,
    summary,
    list,
  };
};
