import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(
  async (session, req, { params }) => {
    const entry = await prisma.entry.findUnique({
      where: { id: params.id },
    });
    return NextResponse.json(entry);
  },
  { requireOwnership: true },
);

// PATCH /api/entries/:id → 특정 유저의 특정 일기 수정
export const PATCH = withAuth(
  async (session, req, { params }) => {
    const data = await req.json();
    const { mood, content } = data;

    const updated = await prisma.entry.update({
      where: { id: params.id },
      data: { mood, content },
    });
    return NextResponse.json(updated);
  },
  { requireOwnership: true },
);

export const DELETE = withAuth(
  async (session, req, { params }) => {
    await prisma.entry.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  },
  { requireOwnership: true },
);
