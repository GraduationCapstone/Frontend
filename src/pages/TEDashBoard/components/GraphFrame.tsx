import type { Summary } from "../types";
import DonutChart from "./DonutChart";
import Dot from "../../../assets/icons/dot.svg?react";

type Props = {
  summary: Summary;
  totalCount: number;
  testedCount: number;
};

const DotItem = (props: { label: string; count: number; colorClass: string }) => {
  const { label, count, colorClass } = props;
  return (
    <div className="inline-flex items-center gap-2">
      <Dot className={["w-8 h-8", colorClass].join(" ")} />
      <span className="text-h4-ko text-grayscale-black">{count}</span>
      <span className="text-h4-ko text-grayscale-black">{label}</span>
    </div>
  );
};

export default function GraphFrame({ summary, totalCount, testedCount }: Props) {
  const passRate =
    testedCount === 0 ? 0 : Math.round((summary.pass / testedCount) * 1000) / 10;

  return (
    <section className="w-l py-10 inline-flex justify-center items-center gap-14">
      <DonutChart summary={summary} />

      <div className="inline-flex flex-col justify-start items-center gap-1">
        <div className="text-h2-ko text-grayscale-black">{passRate}% Pass</div>
        <div className="text-medium500-ko text-grayscale-gy700">
          {testedCount} / {totalCount} Tested
        </div>
      </div>

      <div className="inline-flex flex-col justify-start items-start gap-3">
        <DotItem label="Pass" count={summary.pass} colorClass="text-chip-pass fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current" />
        <DotItem label="Block" count={summary.block} colorClass="text-chip-block fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current" />
        <DotItem label="Fail" count={summary.fail} colorClass="text-chip-fail fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current" />
        <DotItem label="Untest" count={summary.untest} colorClass="text-chip-untest fill-current stroke-current [&_*]:fill-current [&_*]:stroke-current" />
      </div>
    </section>
  );
}
