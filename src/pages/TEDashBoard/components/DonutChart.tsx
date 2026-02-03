import { PieChart, Pie, Tooltip as RechartsTooltip } from "recharts";
import type { Summary } from "../types";
import Tooltip from "../../../components/common/Tooptip";

type Props = {
  summary: Summary;
};

type PieDatum = {
  name: "Pass" | "Block" | "Fail" | "Untest";
  value: number;
  fill: string;
};

const SIZE = 180;

const getTotal = (summary: Summary) =>
  summary.pass + summary.block + summary.fail + summary.untest;

export default function DonutChart({ summary }: Props) {
  const total = getTotal(summary);

  const data: PieDatum[] = [
    { name: "Pass", value: summary.pass, fill: "var(--color-chip-pass)" },
    { name: "Block", value: summary.block, fill: "var(--color-chip-block)" },
    { name: "Fail", value: summary.fail, fill: "var(--color-chip-fail)" },
    { name: "Untest", value: summary.untest, fill: "var(--color-chip-untest)" },
  ];

  return (
    <div style={{ width: SIZE, height: SIZE }}>
      <PieChart width={SIZE} height={SIZE}>
        <RechartsTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;

            const datum = payload[0].payload as PieDatum;
            const percent =
              total > 0 ? (datum.value / total) * 100 : 0;

            return <Tooltip value={percent} digits={2} />;
          }}
        />

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={90}
          stroke="transparent"
          isAnimationActive={false}
        />
      </PieChart>
    </div>
  );
}
