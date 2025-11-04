"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { useState } from "react";
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
export const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 && feedback.trim() === "") {
      alert("별점 또는 피드백을 입력해주세요.");
      return;
    }

    alert("피드백이 전송되었습니다 💛");

    setOpen(false);
    setRating(0);
    setFeedback("");
  };
  return (
    <Dialog>
      <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
        <DialogTrigger>
          <Button
            size="lg"
            className="shadow-test2 bg-primary h-12 w-12 rounded-full"
            asChild
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
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold">
              DayDot 이용 경험은 어떠셨나요?
            </DialogTitle>
            {/* TODO: subscription 추가 (1회, 7회, 30, 30 *n 별) */}
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 grid gap-5">
            {/* 별점 */}
            <div className="grid gap-3">
              <Label>만족도</Label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    className={`text-3xl transition-transform ${
                      i <= rating
                        ? "scale-110 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* 피드백 입력 */}
            <div className="grid gap-3">
              <Label htmlFor="feedback">피드백 남기기</Label>
              <Textarea
                id="feedback"
                placeholder="좋았던 점이나 아쉬운 점을 자유롭게 적어주세요"
                className="resize-none text-sm"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-3 pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  나중에 하기
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-yellow-400 text-black hover:bg-yellow-300"
              >
                보내기
              </Button>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
};
