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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

type RGB = [number, number, number];

const moodColors: Record<MOOD, RGB> = {
  LOVE: [25, 185, 179],
  GOOD: [106, 192, 73],
  NEUTRAL: [244, 203, 57],
  BAD: [218, 104, 13],
  ANGRY: [231, 42, 39],
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MoodTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const { mood, count } = payload[0].payload;
  const color = `rgb(${moodColors[mood as MOOD].join(",")})`;

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
  const { data: statData, isFetched } = useQuery({
    queryKey: queryKeys.entries.stats(),
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
        {statData && statData.total === 0 ? (
          <Empty className="h-full w-full">
            <EmptyHeader className="flex h-full w-full flex-col">
              <EmptyMedia variant="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="gray"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>
              </EmptyMedia>
              <EmptyTitle className="text-primary text-[16px]">
                이번 달 감정이 비어있어요.
              </EmptyTitle>
              <EmptyDescription>
                오늘 하루는 어땠나요? 기록을 남겨보세요.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
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
        )}
      </div>
    </div>
  );
};
