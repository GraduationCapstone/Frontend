import type { TEDashBoardData, TestCodeItem, TestStatus } from './types';
import type {
  ProjectTestSummaryListItem,
  TestDashboardBasicListItem,
  TestDashboardGroupResponse,
} from '../../api/testDashboard';

type GetTEDashBoardDataOptions = {
  group?: TestDashboardGroupResponse | null;
  results?: Array<TestDashboardBasicListItem | ProjectTestSummaryListItem> | null;
};

const normalizeStatus = (status: string | null | undefined): TestStatus => {
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

const toOptionalText = (value: string | null | undefined): string | undefined => {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
};

const formatDate = (completedAt: string | null | undefined): string | undefined => {
  const text = toOptionalText(completedAt);
  return text?.replace('T', ' ').slice(0, 16);
};

const formatCodeId = (id: string): string => {
  const parts = id.split('_');
  if (parts.length !== 3 || parts[0] !== parts[1]) return id;
  return `${parts[0]}_${parts[2]}`;
};

const mapResultToTestCodeItem = (
  result: TestDashboardBasicListItem | ProjectTestSummaryListItem,
  index: number
): TestCodeItem => {
  const id = toOptionalText(result.testCaseId) ?? toOptionalText(result.id);
  const title = toOptionalText(result.testCodeName) ?? toOptionalText(result.testGroupName) ?? '';
  const key = id ?? `${index}`;

  return {
    id: key,
    codeId: id ? formatCodeId(id) : '',
    title,
    status: normalizeStatus(result.status),
    passRatio: toOptionalText(result.passRatio),
    duration: toOptionalText(result.duration) ?? toOptionalText(result.testDuration),
    user: toOptionalText(result.tester) ?? toOptionalText(result.testerName),
    date: formatDate(result.completedAt ?? result.executedAt ?? result.createdAt),
  };
};

const getList = (
  results?: Array<TestDashboardBasicListItem | ProjectTestSummaryListItem> | null
): TestCodeItem[] =>
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
