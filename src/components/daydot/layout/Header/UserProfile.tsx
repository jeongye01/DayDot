"use client";
import React from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export const UserProfile = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {session ? (
        // TODO: dropdown으로 바꾸기
        <Popover>
          <PopoverTrigger asChild>
            <button className="cursor-pointer">
              {session?.user?.image ? (
                <Image
                  src={session?.user?.image}
                  alt="profile"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              ) : (
                <div />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex w-fit flex-col items-start px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              {session?.user?.image ? (
                <Image
                  src={session?.user?.image}
                  alt="profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div />
              )}
              <div className="flex flex-col">
                <p className="text-sm font-medium">{session.user?.name}님</p>
                <p className="text-xs text-gray-500">
                  오늘 하루는 어땠나요? 🌤️{" "}
                  {/* 문구 검토 필요, 낮 밤 시간대 분기처리 필요 */}
                </p>
              </div>
            </div>

            <Separator className="mt-2 mb-2" />
            <button
              onClick={() => signOut()}
              className="cursor-pointer text-sm text-gray-600"
            >
              <div className="flex items-center gap-1">
                <span>로그아웃</span>
                {/* // 이거 로그아웃하고 나서 토스트로 뜨면 좋을듯 */}
                {/* <p className="mt-2 text-[11px] text-gray-400">
                  오늘도 기록해줘서 고마워요 🌙
                </p> */}
              </div>
            </button>
          </PopoverContent>
        </Popover>
      ) : status === "loading" ? (
        <></>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="custom"
              variant="outline"
              className="h-7 border border-gray-400 p-2 text-gray-400"
            >
              로그인
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex w-fit flex-col items-center px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-[16px] font-bold">DayDot 로그인</h1>
              <p className="text-[12px] text-gray-500">
                매일의 점이 모여, 당신을 빛나게 할 거예요 ✨
              </p>
            </div>
            <Separator className="mt-2 mb-2" />
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex h-[41px] w-full cursor-pointer items-center justify-start rounded-full border !border-[#747775] !bg-white !text-[#1F1F1F]"
            >
              <div>
                <Image alt="" src="icons/google.svg" width={40} height={40} />
              </div>
              <span>Google 계정으로 로그인</span>
            </button>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
