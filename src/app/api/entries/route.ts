import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/entries?userId=xxx → 특정 유저의 모든 일기
export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');

      if (!userId) {
         return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const entries = await prisma.entry.findMany({
         where: { userId },
         orderBy: { date: 'desc' },
      });
      return NextResponse.json(entries);
   } catch {
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
   }
}

// POST /api/entries → 특정 유저의 새 일기 작성
export async function POST(req: Request) {
   try {
      const body = await req.json();
      const { content, mood, userId } = body;

      if (!mood || !userId) {
         return NextResponse.json({ error: 'Missing mood or userId' }, { status: 400 });
      }

      const entry = await prisma.entry.create({
         data: {
            content: content ?? null,
            mood,
            date: new Date(),
            userId,
         },
      });

      return NextResponse.json(entry);
   } catch {
      return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
   }
}
