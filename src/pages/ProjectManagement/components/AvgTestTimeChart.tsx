import type { AvgTestTimePoint } from "../types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Props = {

  title: string;
  data: AvgTestTimePoint[];
};

const formatSeconds = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;

  if (m > 0 && s === 0) return `${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const Y_TICKS = [150, 180, 210, 240, 270, 300];

// Y축 tick
function YTick(props: any) {
  const { x, y, payload } = props;
  const value = Number(payload?.value ?? 0);

  return (
    <text
      x={x - 10}
      y={y}
      textAnchor="end"
      dominantBaseline="middle"
      className="text-medium400-ko fill-grayscale-black"
    >
      {formatSeconds(value)}
    </text>
  );
}

// X축 tick 
function XTick(props: any) {
  const { x, y, payload } = props;
  const value = String(payload?.value ?? "");

  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="middle"
      dominantBaseline="hanging"
      className="text-medium400-ko fill-grayscale-black"
    >
      {value}
    </text>
  );
}

export default function AvgTestTimeChart({ title, data }: Props) {
  return (
    <div className="w-xl">
      {/* 정확한 값이 지정돼 있지 않아서 픽셀로 박음 */}
      <div className="w-[700px] h-80 relative">
        <div className="absolute left-0 top-0 text-h4-ko text-grayscale-black">
          {title}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 28, right: 28, bottom: 48, left: 72 }}
          >
            {/* 1) 가로 점선 그리드 */}
            <CartesianGrid
              vertical={false}
              stroke="var(--color-grayscale-gy200)"
              strokeDasharray="6 10"
            />

            {/* x축: 축선 ON + 커스텀 tick */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "var(--color-grayscale-gy400)" }}
              tick={<XTick />}
              tickMargin={20}
              interval={0}
              padding={{ left: 16, right: 16 }}
            />

            {/* y축: 축선 ON + 커스텀 tick */}
            <YAxis
              domain={[
                150,
                (dataMax: number) => Math.max(330, dataMax + 20),
              ]}
              ticks={Y_TICKS}
              tickLine={false}
              tickMargin={40}
              axisLine={{ stroke: "var(--color-grayscale-gy400)" }}
              tick={<YTick />}
            />

            <Line
              type="linear"
              dataKey="seconds"
              stroke="var(--color-primary-sg500)"
              strokeWidth={2}
              dot={{
                r: 6,
                strokeWidth: 2,
                stroke: "var(--color-primary-sg500)",
                fill: "var(--color-primary-sg500)",
              }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
