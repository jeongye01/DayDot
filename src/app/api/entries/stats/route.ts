import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
   try {
      const body = await req.json();
      const { userId } = body;

      if (!userId) {
         return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);

      const entries = await prisma.entry.findMany({
         where: { userId, date: { gte: sevenDaysAgo, lte: today } },
         orderBy: { date: 'asc' },
      });

      // streak 계산
      let streak = 0;
      let currentStreak = 0;
      let prevDate: string | null = null;

      entries.forEach(entry => {
         const entryDate = entry.date.toISOString().split('T')[0];
         if (prevDate) {
            const prev = new Date(prevDate);
            const curr = new Date(entryDate);
            const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) currentStreak += 1;
            else currentStreak = 1;
         } else {
            currentStreak = 1;
         }
         prevDate = entryDate;
         streak = Math.max(streak, currentStreak);
      });

      // mood 통계
      const moodCount: Record<string, number> = {};
      entries.forEach(e => {
         moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
      });
      const mostFrequentMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      return NextResponse.json({
         userId,
         streak,
         totalDays: new Set(entries.map(e => e.date.toISOString().split('T')[0])).size,
         mostFrequentMood,
      });
   } catch {
      return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 });
   }
}
