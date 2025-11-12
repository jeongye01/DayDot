import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (session) => {
  // 오늘 날짜 00:00 ~ 23:59 범위 계산
  const now = new Date();
  const utcMidnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

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
      date: utcMidnight,
    },
  });

  return NextResponse.json({ hasWrittenToday: !!todayEntry });
});
