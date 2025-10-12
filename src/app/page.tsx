"use client"; // TODO: 컴포넌트 분리하면 지우기
import { MoodCalander } from "@/components/daydot/MoodCalander";
import { MoodChart } from "@/components/daydot/MoodChart";
import { StreakCard } from "@/components/daydot/StreakCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import clsx from "clsx";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-4">
      <section>
        <StreakCard />
      </section>
      <section>
        <MoodCalander />
      </section>
      <section>
        <MoodChart />
      </section>
      <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
        <Button
          size="lg"
          className="shadow-test2 bg-primary h-12 w-12 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
