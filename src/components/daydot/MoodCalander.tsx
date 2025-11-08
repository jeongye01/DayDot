import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import clsx from "clsx";
import { DayButtonProps } from "react-day-picker";

import Image from "next/image";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  deleteEntry,
  getEntry,
  getEntryList,
  patchEntry,
  postEntry,
} from "@/lib/queryFns";
import {
  Entry,
  MOOD,
  PatchEntryPayload,
  PostEntryPayload,
} from "@/types/entries";
import { useDebounce } from "@/lib/hooks/useDebounce";

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

const getEntryForDate = (date: Date, entries: Entry[]) => {
  const targetDay = toUTCMidnightISOString(date).split("T")[0]; // UTC 기준 yyyy-mm-dd

  return entries.find((e) => e.date.split("T")[0] === targetDay) ?? null;
};
const toUTCMidnightISOString = (date: Date): string => {
  // 브라우저의 타임존 오프셋(분 단위)
  const offsetMinutes = date.getTimezoneOffset();

  // 로컬 자정으로 설정 후, UTC로 변환
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0);

  // 로컬 자정을 UTC 기준으로 보정
  const utcTime = new Date(localMidnight.getTime() - offsetMinutes * 60 * 1000);

  return utcTime.toISOString();
};

export const getTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getUtcCalendarRange = ({
  year: targetYear,
  month: targetMonth,
}: {
  year: number;
  month: number;
}) => {
  const timeZone = getTimeZone();

  // 현지 기준 달력 범위 계산
  const localStart = startOfWeek(
    startOfMonth(new Date(targetYear, targetMonth - 1)),
    {
      weekStartsOn: 0, // 일요일 시작
    },
  );
  const localEnd = endOfWeek(
    endOfMonth(new Date(targetYear, targetMonth - 1)),
    {
      weekStartsOn: 0,
    },
  );

  return {
    utcStart: toUTCMidnightISOString(localStart),
    utcEnd: toUTCMidnightISOString(localEnd),
  };
};
export const MoodCalander = () => {
  const [month, setMonth] = useState(new Date());

  const year = month.getFullYear();
  const currentMonth = month.getMonth() + 1; // 0~11 → 1~12로 변환
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { utcStart, utcEnd } = getUtcCalendarRange({
    year,
    month: currentMonth,
  });

  const { data: entries = [] } = useQuery({
    queryKey: queryKeys.entries.list({ startDate: utcStart, endDate: utcEnd }),
    queryFn: () => getEntryList({ startDate: utcStart, endDate: utcEnd }),
  });
  const handleDayClick = (date: Date) => {
    const entry = getEntryForDate(date, entries); // 있으면 Entry, 없으면 null
    setSelectedDate(date);
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  return (
    <div // TODO: Container 컴포넌트 만들기
      className="shadow-test2 flex flex-col items-center justify-center rounded-lg bg-white p-2"
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Calendar
          mode="single"
          month={month}
          onMonthChange={setMonth}
          components={{
            DayButton: (dayProps) => {
              return (
                <CustomDayButton
                  {...dayProps}
                  entry={getEntryForDate(dayProps.day.date, entries)}
                  onOpen={() => handleDayClick(dayProps.day.date)}
                />
              );
            },
          }}
          className="w-full"
        />
        {isDialogOpen &&
          (selectedEntry ? (
            <EntryDetailDialog
              entry={selectedEntry}
              onClose={() => setIsDialogOpen(false)}
            />
          ) : (
            <EntryCreateDialog
              date={selectedDate}
              onClose={() => setIsDialogOpen(false)}
            />
          ))}
      </Dialog>
    </div>
  );
};

const CustomDayButton = ({
  entry,
  onOpen,
  day,
}: DayButtonProps & {
  entry: Entry | null;
  onOpen: () => void;
}) => {
  const { date, outside } = day;

  const today = toUTCMidnightISOString(new Date());
  const target = toUTCMidnightISOString(date);

  const isFuture = target > today;
  const isToday = target === today;

  return (
    <DialogTrigger
      className="flex w-fit flex-col items-center"
      disabled={isFuture}
      onClick={() => {
        if (!isFuture) onOpen();
      }}
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
  );
};
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};
const EntryCreateDialog = ({
  date,
  onClose,
}: {
  date: Date;
  onClose: () => void;
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: PostEntryPayload) => postEntry(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      toast.success("기록이 등록 되었습니다!");
      onClose?.();
    },
    onError: (error) => {
      toast.error("기록을 저장하지 못했습니다.");
    },
  });

  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<MOOD>();
  const [keyword, setKeyword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({
      mood: selectedMood,
      content: keyword,
      date: toUTCMidnightISOString(date),
    });
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            <span className="text-[16px]">
              {formatDate(date.toString())} 기록
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="my-4 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Label htmlFor="name-1">감정</Label>
            <RadioGroup
              value={selectedMood}
              onValueChange={(v) => {
                setSelectedMood(v);
              }}
              className="flex justify-center gap-6"
            >
              {Object.entries(MOODS).map(([mood, { img }]) => (
                <div key={mood} className="flex w-12 flex-col items-center">
                  <RadioGroupItem
                    value={mood}
                    id={mood}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={mood}
                    className="flex cursor-pointer flex-col items-center"
                  >
                    <Image alt={mood} width={28} height={28} src={img} />
                    <span
                      className={clsx(
                        "text-[12px]",
                        selectedMood === mood
                          ? "text-gray-900"
                          : "text-gray-300",
                      )}
                    >
                      {mood}
                    </span>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="content">짧은 기록</Label>
            <Textarea
              id="content"
              name="content"
              value={keyword}
              placeholder="오늘 하루는 어땠나요?"
              onChange={(e) => setKeyword(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
const EntryDetailDialog = ({
  entry,
  onClose,
}: {
  entry: Entry;
  onClose: () => void;
}) => {
  // const { data: entry, isSuccess } = useQuery({
  //   queryKey: queryKeys.entries.detail({ id }),
  //   queryFn: () => getEntry({ id }),
  // });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: Entry["id"];
      payload: PatchEntryPayload;
    }) => patchEntry(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
    onError: (error) => {
      console.error("❌ 수정 실패:", error);
    },
  });
  const { mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteEntry(entry.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
      onClose(); // ✅ 모달 닫음
    },
  });
  const date = new Date(entry?.date ?? "");

  // const [selectedMood, setSelectedMood] = useState<MOOD>();
  // const [keyword, setKeyword] = useState("");
  const [selectedMood, setSelectedMood] = useState<MOOD>(entry.mood);
  const [keyword, setKeyword] = useState(entry.content);
  const debouncedKeyword = useDebounce(keyword, 400);

  // useEffect(() => {
  //   if (isSuccess) {
  //     setSelectedMood(entry.mood);
  //     setKeyword(entry.content ?? "");
  //   }
  // }, [isSuccess]);
  useEffect(() => {
    if (entry && entry.mood !== selectedMood) {
      mutate({
        id: entry.id,
        payload: {
          mood: selectedMood,
          content: debouncedKeyword,
        },
      });
    }
  }, [selectedMood]);
  // ✅ 디바운스된 메모 변경 시 PATCH
  useEffect(() => {
    if (entry && entry.content !== debouncedKeyword) {
      mutate({
        id: entry.id,
        payload: {
          mood: selectedMood ?? entry.mood,
          content: debouncedKeyword,
        },
      });
    }
  }, [debouncedKeyword]);
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center gap-3">
            <span className="text-[16px]">{formatDate(date.toString())}</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="custom"
                  size="custom"
                  className="rounded-full border border-gray-200 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="var(--color-gray-900)"
                    className="size-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-4 border-gray-200 bg-white"
              >
                <DropdownMenuItem
                  className="text-accent-red flex items-center gap-1 py-1 text-[12px]"
                  onClick={() => mutateDelete()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  <span>삭제</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="">
        <div className="flex items-start gap-2">
          <div className="-mt-[10px] -ml-[10px]">
            {selectedMood && (
              <Image
                alt="happy"
                width={52}
                height={52}
                src={MOODS[selectedMood]?.img}
              />
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <div className="gpa-2 -mt-[2px] flex flex-col">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="custom"
                    size="custom"
                    className="flex w-fit items-center gap-1 border !border-gray-200 px-1 py-1"
                  >
                    <span className="text-[12px]">{selectedMood}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="size-3"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-36 border-gray-200 bg-white"
                >
                  <DropdownMenuRadioGroup
                    value={selectedMood}
                    onValueChange={(v) => {
                      setSelectedMood(v);
                    }}
                  >
                    {Object.entries(MOODS).map(([mood, { img }]) => (
                      <DropdownMenuRadioItem value={mood} className="pl-5">
                        <div className="flex items-center justify-start">
                          <Image alt="happy" width={24} height={24} src={img} />
                          <span>{mood}</span>
                        </div>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* // TODO: 모양에 변화 줘보기 */}
            <Textarea
              id="content"
              name="content"
              placeholder="왜 이런 기분이 들었나요?"
              defaultValue={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="resize-none !border-gray-200 !shadow-none"
            />
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
