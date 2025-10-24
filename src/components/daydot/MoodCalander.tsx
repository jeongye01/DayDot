import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import clsx from "clsx";
import { DayButtonProps } from "react-day-picker";

import Image from "next/image";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getEntryList } from "@/lib/queryFns";

const moodColors: Record<string, string> = {
  HAPPY: "bg-pink-300",
  GOOD: "bg-yellow-300",
  NEUTRAL: "bg-gray-300",
  BAD: "bg-blue-300",
  ANGRY: "bg-red-300",
};

const FORM_MOODS = [
  {
    value: "HAPPY",
    img: "icons/happy.svg",
  },
  {
    value: "GOOD",
    img: "icons/good.svg",
  },
  {
    value: "NEUTRAL",
    img: "icons/neutral.svg",
  },
  {
    value: "BAD",
    img: "icons/bad.svg",
  },
  {
    value: "ANGRY",
    img: "icons/angry.svg",
  },
];

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
  const { data } = useQuery({
    queryKey: queryKeys.entries.list({}),
    queryFn: () => getEntryList({}),
  });
  console.log(data);
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
  // TODO: 다이어로그 달력 하나에서 호출하도록 로직 수정
  return (
    <Dialog>
      <DialogTrigger
        className="flex w-fit flex-col items-center"
        onClick={() => console.log("click")}
      >
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
      </DialogTrigger>

      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-[16px]">2025.10.12 기록</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 mb-4 grid gap-5">
            <div className="grid gap-3">
              <Label htmlFor="name-1">감정</Label>
              <RadioGroup className="flex justify-between gap-4 px-5">
                {FORM_MOODS.map((mood) => (
                  <div
                    key={mood.value}
                    className="flex w-12 flex-col items-center"
                  >
                    <RadioGroupItem
                      value={mood.value}
                      id={mood.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="happy"
                      className="flex cursor-pointer flex-col items-center !gap-0 text-sm peer-data-[state=checked]:text-yellow-500"
                    >
                      <Image
                        alt={mood.value}
                        width={28}
                        height={28}
                        src={mood.img}
                      />
                      <span className="text-[12px] text-gray-500">
                        {mood.value}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">짧은 기록</Label>
              <Textarea
                id="username-1"
                name="username"
                defaultValue="@peduarte"
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit">저장</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
