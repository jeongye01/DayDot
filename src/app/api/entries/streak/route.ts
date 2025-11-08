import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
// TODO: 성능 개선 고민 필요
// FIXME: 연속 기록 버그 있음. 이틀 이상 기록 안해야 연속 일수 초기화 됌
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
  const now = new Date();
  const utcMidnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  // ✅ 어제 기록이 있으면 streak 유지
  const yesterdayUtc = new Date(utcMidnight);
  yesterdayUtc.setUTCDate(utcMidnight.getUTCDate() - 1);
  yesterdayUtc.setUTCHours(0, 0, 0, 0);
  // ✅ 오늘 기록 여부
  const hasTodayEntry = entries.some(
    (e) =>
      e.date.toISOString().split("T")[0] ===
      utcMidnight.toISOString().split("T")[0],
  );

  // ✅ 어제 기록 여부
  const hasYesterdayEntry = entries.some(
    (e) =>
      e.date.toISOString().split("T")[0] ===
      yesterdayUtc.toISOString().split("T")[0],
  );

  // ✅ 오늘 기록이 있으면 유지, 없고 어제 기록도 없으면 끊김
  if (hasTodayEntry || hasYesterdayEntry) {
    // streak 유지 (아무것도 안 함)
  } else {
    currentStreak = 0;
  }

  return NextResponse.json({ currentStreak, maxStreak });
});
