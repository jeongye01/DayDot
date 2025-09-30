import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/entries/:id?userId=xxx → 특정 유저의 특정 일기 조회
export async function GET(req: Request, { params }: { params: { id: string } }) {
   try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');

      if (!userId) {
         return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const entry = await prisma.entry.findUnique({
         where: { id: params.id },
      });

      if (!entry || entry.userId !== userId) {
         return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      }

      return NextResponse.json(entry);
   } catch {
      return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
   }
}

// PATCH /api/entries/:id → 특정 유저의 특정 일기 수정
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
   try {
      const body = await req.json();
      const { content, mood, userId } = body;

      if (!userId) {
         return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const entry = await prisma.entry.updateMany({
         where: { id: params.id, userId },
         data: {
            ...(content !== undefined && { content }),
            ...(mood && { mood }),
         },
      });

      if (entry.count === 0) {
         return NextResponse.json({ error: 'Entry not found or unauthorized' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Updated' });
   } catch {
      return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
   }
}

// DELETE /api/entries/:id → 특정 유저의 특정 일기 삭제
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
   try {
      const body = await req.json();
      const { userId } = body;

      if (!userId) {
         return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const deleted = await prisma.entry.deleteMany({
         where: { id: params.id, userId },
      });

      if (deleted.count === 0) {
         return NextResponse.json({ error: 'Entry not found or unauthorized' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Deleted' });
   } catch {
      return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
   }
}
