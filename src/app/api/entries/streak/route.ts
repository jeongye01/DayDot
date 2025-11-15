import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { toUTCMidnightISOString } from "@/lib/utils";
// TODO: 성능 개선 고민 필요

export const GET = withAuth(async (session) => {
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

    // 2. 일수 차이 계산
    const diffTime = curr.getTime() - prev.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // 3. 차이가 '정확히 1'인지 확인
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      // 하루를 건너뛰었다면 스트릭 리셋
      currentStreak = 1;
    }
  }
  const now = new Date();
  const todayUtc = new Date(toUTCMidnightISOString(now));

  const yesterdayUtc = new Date(todayUtc);
  yesterdayUtc.setUTCDate(todayUtc.getUTCDate() - 1);

  // ✅ 오늘 기록 여부
  const hasTodayEntry = entries.some(
    (e) =>
      e.date.toISOString().split("T")[0] ===
      toUTCMidnightISOString(now).split("T")[0],
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
