import type { TEDashBoardData, TestCodeItem, TestStatus } from './types';
import type { TestDashboardGroupResponse } from '../../api/testDashboard';

type GetTEDashBoardDataOptions = {
  group?: TestDashboardGroupResponse | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const pickValue = (source: Record<string, unknown>, keys: string[]): unknown => {
  const matchedKey = keys.find((key) => source[key] !== undefined);
  return matchedKey ? source[matchedKey] : undefined;
};

const toText = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};

const normalizeStatus = (value: unknown): TestStatus => {
  const normalized = toText(value)
    ?.replace(/[\s_-]/g, '')
    .toUpperCase();

  if (normalized === 'PASS' || normalized === 'PASSED' || normalized === 'SUCCESS') {
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

const formatDuration = (value: unknown): string | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}s`;
  }

  return toText(value);
};

const formatDate = (value: unknown): string | undefined => {
  const text = toText(value);
  if (!text) return undefined;

  return text.replace('T', ' ').slice(0, 16);
};

const getGroupResults = (group: TestDashboardGroupResponse): unknown[] => {
  const candidates = [
    group.results,
    group.testResults,
    group.testCodeResults,
    group.testCodes,
    group.list,
  ];

  return candidates.find((candidate): candidate is unknown[] => Array.isArray(candidate)) ?? [];
};

const mapResultToTestCodeItem = (result: Record<string, unknown>, index: number): TestCodeItem => {
  const id =
    toText(pickValue(result, ['resultId', 'testResultId', 'testCodeId', 'id'])) ??
    `result-${index + 1}`;
  const codeId =
    toText(pickValue(result, ['codeId', 'testCodeId', 'testCodeSerial', 'testCaseId', 'testId'])) ??
    id;
  const title =
    toText(pickValue(result, ['title', 'testCodeName', 'name', 'testName', 'testCaseName'])) ??
    id;

  return {
    id,
    codeId,
    title,
    status: normalizeStatus(pickValue(result, ['status', 'result', 'testStatus'])),
    duration: formatDuration(
      pickValue(result, ['duration', 'elapsedTime', 'executionTime', 'testTime'])
    ),
    user: toText(pickValue(result, ['user', 'username', 'createdBy', 'tester'])),
    date: formatDate(
      pickValue(result, ['date', 'createdAt', 'updatedAt', 'executedAt', 'testedAt'])
    ),
  };
};

const getList = (group: TestDashboardGroupResponse | null | undefined): TestCodeItem[] => {
  if (!group) return [];

  return getGroupResults(group)
    .filter(isRecord)
    .map((result, index) => mapResultToTestCodeItem(result, index));
};

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
  const list = getList(group);
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
