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
import { getEntry, getEntryList } from "@/lib/queryFns";
import { Entry, MOOD } from "@/types/entries";

const moodColors: Record<string, string> = {
  LOVE: "bg-pink-300",
  GOOD: "bg-yellow-300",
  NEUTRAL: "bg-gray-300",
  BAD: "bg-blue-300",
  ANGRY: "bg-red-300",
};
const MOODS: Record<MOOD, { img: string }> = {
  LOVE: {
    img: "icons/love.svg",
  },
  GOOD: {
    img: "icons/good.svg",
  },
  NEUTRAL: { img: "icons/neutral.svg" },
  BAD: { img: "icons/bad.svg" },
  ANGRY: { img: "icons/angry.svg" },
};
const FORM_MOODS = [
  {
    value: "LOVE",
    img: "icons/love.svg",
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
const normalize = (d: Date) => {
  const n = new Date(d);
  n.setHours(12, 0, 0, 0); // UTC 시차 보정
  return n;
};

const getEntryForDate = (date: Date, entries: Entry[]) => {
  const normalized = date.toISOString().split("T")[0];
  return entries.find((e) => e.date.startsWith(normalized)) ?? null;
};

export const MoodCalander = () => {
  const [selected, setSelected] = useState<Date>();

  const { data: entries = [] } = useQuery({
    queryKey: queryKeys.entries.list({}),
    queryFn: () => getEntryList({}),
  });

  return (
    <div // TODO: Container 컴포넌트 만들기
      className="shadow-test2 flex flex-col items-center justify-center rounded-lg bg-white p-2"
    >
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
        components={{
          DayButton: (dayProps) => (
            <CustomDayButton
              {...dayProps}
              entry={getEntryForDate(dayProps.day.date, entries)}
            />
          ),
        }}
        className="w-full"
      />
    </div>
  );
};

const CustomDayButton = (props: DayButtonProps & { entry: Entry | null }) => {
  const { date, outside } = props.day;
  const entry = props.entry;

  const today = normalize(new Date());
  const target = normalize(date);

  const isFuture = target.getTime() > today.getTime();
  const isToday = target.getTime() === today.getTime();

  return (
    <Dialog>
      <DialogTrigger
        className="flex w-fit flex-col items-center"
        disabled={isFuture}
        onClick={() => console.log(isFuture ? "isFuture" : "register")}
      >
        <div
          className={clsx(
            "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100",
            isToday && "!bg-primary text-white",
          )}
        >
          {isFuture ? (
            <></>
          ) : isToday ? (
            <div className="animate-heartbeat">
              {entry ? (
                <Image
                  alt=""
                  src={MOODS[entry.mood].img}
                  width={28}
                  height={28}
                />
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
          ) : (
            <>
              {entry ? (
                <Image
                  alt=""
                  src={MOODS[entry.mood].img}
                  width={28}
                  height={28}
                />
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
            </>
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

      {entry ? <EntryDetailDialog id={entry.id} /> : <EntryCreateDialog />}
    </Dialog>
  );
};

const EntryCreateDialog = () => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <form>
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
      </form>
    </DialogContent>
  );
};
const EntryDetailDialog = ({ id }: { id: Entry["id"] }) => {
  const { data: entry } = useQuery({
    queryKey: queryKeys.entries.detail({ id }),
    queryFn: () => getEntry({ id }),
  });

  const date = new Date(entry?.date ?? "");
  const formattedDate = date
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/-/g, ".");
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-[16px]">{formattedDate}</span>
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="">
        <div className="flex items-start gap-2">
          <div className="-mt-[6px] -ml-[8px]">
            {entry && (
              <Image
                alt="happy"
                width={48}
                height={48}
                src={MOODS[entry.mood]?.img}
              />
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <div className="-mt-[2px] flex flex-col">
              <span className="text-[12px] text-gray-500">{formattedTime}</span>
              <span className="text-[12px] font-bold">{entry?.mood}</span>
            </div>
            <div className="h-20 w-full rounded-sm border p-2 text-sm">
              {entry?.content}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
