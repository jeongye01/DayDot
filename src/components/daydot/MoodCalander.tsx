import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const moodColors: Record<string, string> = {
  LOVE: "bg-pink-300",
  HAPPY: "bg-yellow-300",
  NEUTRAL: "bg-gray-300",
  SAD: "bg-blue-300",
  ANGRY: "bg-red-300",
};

export const MoodCalander = () => {
  const [selected, setSelected] = useState<Date>();
  const entries = [
    { date: "2025-10-01", mood: "HAPPY" },
    { date: "2025-10-02", mood: "LOVE" },
    { date: "2025-10-03", mood: "SAD" },
  ];

  // 문자열 → Date 변환
  const getMoodForDate = (date: Date) => {
    const d = date.toISOString().split("T")[0];
    return entries.find((e) => e.date === d)?.mood ?? null;
  };

  return (
    <div // TODO: Container 컴포넌트 만들기
      className="shadow-test2 flex flex-col items-center justify-center rounded-lg bg-white p-2"
    >
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        className="w-full"
      />
    </div>
  );
};
