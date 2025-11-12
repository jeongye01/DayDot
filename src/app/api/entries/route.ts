import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (session, req) => {
  const url = new URL(req.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 },
    );
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

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
});

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
  return NextResponse.json(entry, { status: 201 });
});
