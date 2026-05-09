import type { ProjectDetail, Summary } from "../types";
import DonutChart from "../../TEDashBoard/components/DonutChart";
import Dot from "../../../assets/icons/dot.svg?react";

type Props = {
  summary: ProjectDetail["summary"];
};

const normalizeSummary = (s: ProjectDetail["summary"] | null | undefined): Summary => ({
  pass: Number(s?.counts.pass ?? 0) || 0,
  block: Number(s?.counts.block ?? 0) || 0,
  fail: Number(s?.counts.fail ?? 0) || 0,
  untest: Number(s?.counts.untest ?? 0) || 0,
});

const DotItem = (props: {
  label: "Pass" | "Block" | "Fail" | "Untest";
  count: number;
  colorClass: string;
}) => {
  const { label, count, colorClass } = props;

  return (
    <div className="relative group inline-flex items-center gap-1">
      <Dot className={["w-8 h-8", colorClass].join(" ")} />
      <span className="text-h4-ko text-grayscale-black">{count}</span>
      <span className="text-h4-ko text-grayscale-black">{label}</span>
    </div>
  );
};

export default function ProjectSummarySection({ summary }: Props) {
  const apiSummary = normalizeSummary(summary);
  const effectiveSummary = apiSummary;

  return (
    <section className="w-l py-10 inline-flex justify-center items-center gap-14">
      <DonutChart summary={effectiveSummary} />

      <div className="inline-flex flex-col justify-start items-center gap-1">
        <div className="text-h2-ko text-grayscale-black">{summary.passRateText}</div>
        <div className="text-medium500-ko text-grayscale-gy700">
          {summary.testedText}
        </div>
      </div>

      <div className="inline-flex flex-col justify-start items-start gap-3">
        <DotItem
          label="Pass"
          count={effectiveSummary.pass}
          colorClass="text-chip-pass fill-current [&_*]:fill-current"
        />
        <DotItem
          label="Block"
          count={effectiveSummary.block}
          colorClass="text-chip-block fill-current [&_*]:fill-current"
        />
        <DotItem
          label="Fail"
          count={effectiveSummary.fail}
          colorClass="text-chip-fail fill-current [&_*]:fill-current"
        />
        <DotItem
          label="Untest"
          count={effectiveSummary.untest}
          colorClass="text-chip-untest fill-current [&_*]:fill-current"
        />
      </div>
    </section>
  );
}
