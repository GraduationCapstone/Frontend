import type { ProjectDetail, Summary } from "../types";
import DonutChart from "../../TEDashBoard/components/DonutChart";
import Dot from "../../../assets/icons/dot.svg?react";
import Tooltip from "../../../components/common/Tooptip";

type Props = {
  summary: ProjectDetail["summary"];
};

const MOCK_SUMMARY: Summary = {
  pass: 12,
  block: 3,
  fail: 2,
  untest: 5,
};

const normalizeSummary = (s: ProjectDetail["summary"] | null | undefined): Summary => ({
  pass: Number((s as any)?.pass ?? 0) || 0,
  block: Number((s as any)?.block ?? 0) || 0,
  fail: Number((s as any)?.fail ?? 0) || 0,
  untest: Number((s as any)?.untest ?? 0) || 0,
});

const getTotal = (s: Summary) => s.pass + s.block + s.fail + s.untest;

const DotItem = (props: {
  label: "Pass" | "Block" | "Fail" | "Untest";
  count: number;
  totalCount: number;
  colorClass: string;
}) => {
  const { label, count, totalCount, colorClass } = props;

  const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;

  return (
    <div className="relative group inline-flex items-center gap-1">
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-10 hidden group-hover:block">
        <Tooltip value={percent} digits={2} />
      </div>

      <Dot className={["w-8 h-8", colorClass].join(" ")} />
      <span className="text-h4-ko text-grayscale-black">{count}</span>
      <span className="text-h4-ko text-grayscale-black">{label}</span>
    </div>
  );
};

export default function ProjectSummarySection({ summary }: Props) {
  const apiSummary = normalizeSummary(summary);
  const apiTotal = getTotal(apiSummary);

  // TODO(api): API 연결 후, 실데이터가 정상적으로 들어오면 이 로직 제거/수정
  const useMock = import.meta.env.DEV && apiTotal === 0;

  const effectiveSummary = useMock ? MOCK_SUMMARY : apiSummary;

  const totalCount = getTotal(effectiveSummary);
  const testedCount = effectiveSummary.pass + effectiveSummary.block + effectiveSummary.fail;
  const passRate =
    testedCount === 0 ? 0 : Math.round((effectiveSummary.pass / testedCount) * 1000) / 10;

  return (
    <section className="w-l py-10 inline-flex justify-center items-center gap-14">
      <DonutChart summary={effectiveSummary} />

      <div className="inline-flex flex-col justify-start items-center gap-1">
        <div className="text-h2-ko text-grayscale-black">{passRate}% Pass</div>
        <div className="text-medium500-ko text-grayscale-gy700">
          {testedCount} / {totalCount} Tested
        </div>
      </div>

      <div className="inline-flex flex-col justify-start items-start gap-3">
        <DotItem
          label="Pass"
          count={effectiveSummary.pass}
          totalCount={totalCount}
          colorClass="text-chip-pass fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current"
        />
        <DotItem
          label="Block"
          count={effectiveSummary.block}
          totalCount={totalCount}
          colorClass="text-chip-block fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current"
        />
        <DotItem
          label="Fail"
          count={effectiveSummary.fail}
          totalCount={totalCount}
          colorClass="text-chip-fail fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current"
        />
        <DotItem
          label="Untest"
          count={effectiveSummary.untest}
          totalCount={totalCount}
          colorClass="text-chip-untest fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current"
        />
      </div>
    </section>
  );
}