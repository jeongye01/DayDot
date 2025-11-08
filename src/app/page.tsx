"use client";
import { MoodCalander } from "@/components/daydot/MoodCalander";
import { MoodChart } from "@/components/daydot/MoodChart";
import { StreakCard } from "@/components/daydot/StreakCard";

export default function Home() {
  return (
    <div className="flex h-full flex-col gap-4">
      <section>
        <StreakCard />
      </section>
      <section>
        <MoodCalander />
      </section>
      <section>
        <MoodChart />
      </section>
    </div>
  );
}
