import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (session, req, { params }) => {
  // TODO: 반복 로직 없애기
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const entries = await prisma.entry.findMany({
    where: { userId: user.id },
    select: { date: true },
    orderBy: { date: "asc" },
  });

  if (entries.length === 0) {
    return NextResponse.json({ currentStreak: 0, maxStreak: 0 });
  }

  const uniqueDays = [
    ...new Set(entries.map((e) => e.date.toISOString().split("T")[0])),
  ];

  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  // ✅ 어제 기록이 있으면 streak 유지
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const hasYesterdayEntry = entries.some((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === yesterday.getTime();
  });

  if (hasYesterdayEntry) {
    // 유지 (currentStreak 그대로)
  } else {
    currentStreak = 0;
  }

  return NextResponse.json({ currentStreak, maxStreak });
});
