"use client"; // TODO: 컴포넌트 분리하면 지우기
import { FeedbackButton } from "@/components/daydot/FeedbackButton";
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
      <FeedbackButton />
    </div>
  );
}
