import { Line, LineChart, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { ActiveDotType } from "recharts/types/util/types";

type RGB = [number, number, number];

const moodColors: Record<string, RGB> = {
  HAPPY: [255, 213, 79],
  GOOD: [255, 183, 77],
  NEUTRAL: [189, 189, 189],
  BAD: [100, 181, 246],
  ANGRY: [229, 115, 115],
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

// 👉 예: getWeightedColor(moodData) → "rgb(241, 182, 120)"
const moodData = [
  { mood: "HAPPY", count: 90 },
  { mood: "GOOD", count: 10 },
  { mood: "NEUTRAL", count: 10 },
  { mood: "BAD", count: 4 },
  { mood: "ANGRY", count: 3 },
];
export const MoodChart = () => {
  const waveColor = getWeightedColor(moodData);

  return (
    <div className="shadow-test2 flex h-50 flex-col items-center justify-center gap-2 rounded-lg bg-white p-2">
      <div className="flex h-64 w-full flex-col items-center justify-center">
        <div className="flex items-end gap-1">
          <p className="text-sm text-gray-800">이번 달, 감정 비율로 만든 색</p>
          {/* TODO: 툴팁에 
          🌈 rgb(241, 182, 120)  
당신의 감정이 그려낸 이번 달의 빛이에요. */}
          <div
            className="mb-1 h-2 w-2 rounded-full"
            style={{
              background: waveColor,
              boxShadow: `0 0 12px ${waveColor}`,
            }}
          />
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData}>
            <Line
              type="monotone"
              dataKey="count"
              stroke={waveColor}
              strokeWidth={5}
              dot={false}
              activeDot={{ r: 6 }}
              style={{
                filter: `drop-shadow(0 0 px ${waveColor})`,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
