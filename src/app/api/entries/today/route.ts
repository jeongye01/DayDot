import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (session, req, { params }) => {
  // 오늘 날짜 00:00 ~ 23:59 범위 계산
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

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
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  return NextResponse.json({ hasWrittenToday: !!todayEntry });
});
