import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-response";
import { FIRST_TIME_QUESTIONS, pickQuestions } from "@/lib/colorTheoryContent";

export const maxDuration = 30;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const lastPlay = await prisma.gamePlay.findFirst({
    where: { userId: user.id, game: "COLOR_THEORY" },
    orderBy: { playedAt: "desc" },
  });

  if (!lastPlay) {
    return NextResponse.json({ questions: FIRST_TIME_QUESTIONS, isFirstEver: true });
  }

  let previousQuestions: string[] = [];
  try {
    const parsed = JSON.parse(lastPlay.result) as { questions?: string[] };
    previousQuestions = parsed.questions ?? [];
  } catch {
    // ignore malformed rows
  }

  return NextResponse.json({
    questions: pickQuestions(previousQuestions),
    isFirstEver: false,
  });
}
