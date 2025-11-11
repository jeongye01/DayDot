"use client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PostFeedbackPayload } from "@/types/feedback";
import { postFeedback } from "@/lib/queryFns";

export const FeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<PostFeedbackPayload["rating"] | 0>(0);
  const [feedback, setFeedback] = useState("");
  const { mutate } = useMutation({
    mutationFn: ({ payload }: { payload: PostFeedbackPayload }) =>
      postFeedback(payload),
    onSuccess: () => {
      toast.success("감사합니다. 피드백이 전송 되었습니다.");
    },
    onError: () => {
      toast.success("오류가 발생했습니다.");
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 && feedback.trim() === "") {
      alert("별점 또는 피드백을 입력해주세요.");
      return;
    }

    mutate({
      payload: {
        rating: rating as PostFeedbackPayload["rating"],
        comment: feedback,
      },
    });
    setOpen(false);
    setRating(0);
    setFeedback("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="s flex flex-col items-end gap-2">
        <DialogTrigger>
          <Button
            size="lg"
            className="shadow-test2 bg-primary h-7 w-fit rounded-full text-[12px] text-white"
            asChild
          >
            <div>Feedback</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold">
              DayDot 이용 경험은 어떠셨나요?
            </DialogTitle>
            <DialogDescription>
              더 나은 서비스로 보답드리고 싶습니다.
            </DialogDescription>

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
