import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (session, req) => {
  try {
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "유효하지 않은 평점입니다." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Feedback submitted", feedback });
  } catch (error) {
    console.error("Feedback Error:", error);
    return NextResponse.json(
      { error: "피드백 저장 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
});
