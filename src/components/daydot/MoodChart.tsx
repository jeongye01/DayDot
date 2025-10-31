import { getStats } from "@/lib/queryFns";
import { queryKeys } from "@/lib/queryKeys";
import { MOOD } from "@/types/entries";

import { useQuery } from "@tanstack/react-query";
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

const moodColors: Record<MOOD, RGB> = {
  LOVE: [25, 185, 179],
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
const getWeightedColor = (data?: Record<MOOD, number>) => {
  if (!data) return "";
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  if (total === 0) return "rgb(200, 200, 200)"; // 기본값 (데이터 없을 때)

  const mixed = [0, 0, 0];

  Object.entries(data).forEach(([mood, count]) => {
    const weight = count / total;
    const color = moodColors[mood as MOOD]; // 예: [255, 100, 50]
    mixed[0] += color[0] * weight;
    mixed[1] += color[1] * weight;
    mixed[2] += color[2] * weight;
  });

  return `rgb(${mixed.map(Math.round).join(",")})`;
};

export const MoodChart = () => {
  const { data: statData } = useQuery({
    queryKey: queryKeys.entries.streak(),
    queryFn: () => getStats(),
  });
  const waveColor = getWeightedColor(statData?.stats);
  const moodData = [
    { mood: "LOVE", count: statData?.stats?.["LOVE"] ?? 0, index: 0 },
    { mood: "GOOD", count: statData?.stats?.["GOOD"] ?? 0, index: 1 },
    { mood: "NEUTRAL", count: statData?.stats?.["NEUTRAL"] ?? 0, index: 2 },
    { mood: "BAD", count: statData?.stats?.["BAD"] ?? 0, index: 3 },
    { mood: "ANGRY", count: statData?.stats?.["ANGRY"] ?? 0, index: 4 },
  ];
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
