import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

type RGB = [number, number, number];

const moodColors: Record<string, RGB> = {
  HAPPY: [25, 185, 179],
  GOOD: [106, 192, 73],
  NEUTRAL: [244, 203, 57],
  BAD: [218, 104, 13],
  ANGRY: [231, 42, 39],
};
const MoodTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const { mood, count } = payload[0].payload;
  const color = `rgb(${moodColors[mood].join(",")})`;

  return (
    <div
      className="flex items-center gap-1 rounded-lg border bg-white px-2 py-1 shadow-md"
      style={{
        borderColor: color,
        boxShadow: `0 0 8px ${color}33`,
      }}
    >
      <div className="flex items-center gap-1">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-sm" style={{ color }}>
          {mood}
        </p>
      </div>
      <p className="text-xs text-gray-700"> x{count}</p>
    </div>
  );
};
const getWeightedColor = (data: { mood: string; count: number }[]) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const mixed = [0, 0, 0];
  data.forEach((d) => {
    const weight = d.count / total;
    const color = moodColors[d.mood];
    mixed[0] += color[0] * weight;
    mixed[1] += color[1] * weight;
    mixed[2] += color[2] * weight;
  });
  return `rgb(${mixed.map(Math.round).join(",")})`;
};

const moodData = [
  { mood: "HAPPY", count: 10, index: 0 },
  { mood: "GOOD", count: 10, index: 1 },
  { mood: "NEUTRAL", count: 10, index: 2 },
  { mood: "BAD", count: 1, index: 3 },
  { mood: "ANGRY", count: 4, index: 4 },
];

export const MoodChart = () => {
  const waveColor = getWeightedColor(moodData);

  return (
    <div className="shadow-test2 relative flex h-50 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-white p-2">
      <div className="![&_*:focus-visible]:outline-none flex h-64 w-full flex-col items-center justify-center outline-none focus:outline-none">
        <div className="flex items-end gap-1">
          <p className="text-sm text-gray-800">이번 달, 감정 비율로 만든 색</p>
          <div
            className="mb-1 h-2 w-2 rounded-full"
            style={{
              background: waveColor,
              boxShadow: `0 0 12px ${waveColor}`,
            }}
          />
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={moodData}>
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={waveColor} stopOpacity={0.6} />
                <stop offset="100%" stopColor={waveColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="index" hide />
            <YAxis hide />
            <Tooltip content={<MoodTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={waveColor}
              strokeWidth={2}
              fill="url(#waveGradient)"
              fillOpacity={1}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
