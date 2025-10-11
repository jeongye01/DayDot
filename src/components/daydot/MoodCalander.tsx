import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

import clsx from "clsx";
import { DayButtonProps } from "react-day-picker";

import Image from "next/image";

const moodColors: Record<string, string> = {
  HAPPY: "bg-pink-300",
  GOOD: "bg-yellow-300",
  NEUTRAL: "bg-gray-300",
  BAD: "bg-blue-300",
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
        components={{
          DayButton: CustomDayButton,
        }}
        className="w-full"
      />
    </div>
  );
};

const CustomDayButton = (props: DayButtonProps) => {
  const { date, outside, dateLib } = props.day;

  const normalize = (d: Date) => {
    const n = new Date(d);
    n.setHours(12, 0, 0, 0); // UTC 시차 보정
    return n;
  };

  const today = normalize(new Date());
  const target = normalize(date);

  const isFuture = target.getTime() > today.getTime();
  const isToday = target.getTime() === today.getTime();
  return (
    <div className="flex flex-col items-center">
      <div
        className={clsx(
          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100",
          isToday && "!bg-primary text-white",
        )}
      >
        {isFuture ? (
          <Image alt="" src="icons/happy.svg" width={28} height={28} />
        ) : isToday ? (
          <div className="animate-heartbeat">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        )}
      </div>
      <span
        className={clsx(
          "text-[12px]",
          outside && "text-gray-400",
          isToday && "text-primary",
        )}
      >
        {/* TODO: 무드 색 글자 옆에 넣기 */}
        {date.getDate()}
      </span>
    </div>
  );
};
