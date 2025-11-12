import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { toUTCMidnight } from "@/lib/utils";
interface MoodStats {
  [key: string]: number;
}
export const GET = withAuth(async (session) => {
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 이번 달 1일 ~ 다음 달 1일 범위
  const now = new Date();
  const utcMidnight = toUTCMidnight(now);

  const startOfMonth = new Date(
    utcMidnight.getFullYear(),
    utcMidnight.getMonth(),
    1,
  );
  const startOfNextMonth = new Date(
    utcMidnight.getFullYear(),
    utcMidnight.getMonth() + 1,
    1,
  );

  const entries = await prisma.entry.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    },
    select: { mood: true },
  });

  if (entries.length === 0) {
    return NextResponse.json({
      summaryMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
      total: 0,
      stats: { LOVE: 0, GOOD: 0, NEUTRAL: 0, BAD: 0, ANGRY: 0 },
      mostFrequentMood: null,
    });
  }

  // 감정 카운트 계산
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // @ts-ignore
  const stats = entries.reduce<MoodStats>(
    (acc, e) => {
      acc[e.mood] = (acc[e.mood] || 0) + 1;
      return acc;
    },
    { LOVE: 0, GOOD: 0, NEUTRAL: 0, BAD: 0, ANGRY: 0 },
  );
  console.log("MoodStats type:", typeof ({} as MoodStats));
  // 가장 많이 나온 감정
  const mostFrequentMood = Object.entries(stats).reduce((a, b) =>
    b[1] > a[1] ? b : a,
  )[0];

  return NextResponse.json({
    summaryMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    total: entries.length,
    stats,
    mostFrequentMood,
  });
});
