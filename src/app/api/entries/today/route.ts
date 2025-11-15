import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { toUTCMidnightISOString } from "@/lib/utils";

export const GET = withAuth(async (session) => {
  // 오늘 날짜 00:00 ~ 23:59 범위 계산

  const now = new Date();

  // 유저 정보 확인
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 오늘 일기 있는지 확인
  const todayEntry = await prisma.entry.findFirst({
    where: {
      userId: user.id,
      date: toUTCMidnightISOString(now),
    },
  });

  return NextResponse.json({ hasWrittenToday: !!todayEntry });
});
