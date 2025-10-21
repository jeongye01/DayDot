import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(
  async (session, req) => {
    const url = new URL(req.url);
    const year = parseInt(url.searchParams.get("year") || "0", 10);
    const month = parseInt(url.searchParams.get("month") || "0", 10);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || now.getMonth() + 1;

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const entries = await prisma.entry.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(entries);
  },
  { requireOwnership: true },
);

export const POST = withAuth(async (session, req: Request) => {
  const data = await req.json();
  const { mood, content, date } = data;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const entry = await prisma.entry.create({
    data: {
      mood,
      content,
      date: new Date(date),
      userId: user!.id,
    },
  });
  return NextResponse.json(entry);
});
