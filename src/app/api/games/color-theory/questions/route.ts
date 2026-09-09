import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-response";
import { FIRST_TIME_QUESTIONS, pickQuestions } from "@/lib/colorTheoryContent";

export const maxDuration = 30;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const pastPlays = await prisma.gamePlay.findMany({
    where: { userId: user.id, game: "COLOR_THEORY" },
    orderBy: { playedAt: "desc" },
    select: { result: true },
  });

  if (pastPlays.length === 0) {
    return NextResponse.json({ questions: FIRST_TIME_QUESTIONS, isFirstEver: true });
  }

  // Exclude every question asked across all of this user's past plays (not
  // just the most recent one), so a question doesn't resurface until the
  // whole 1,000-question pool has been used.
  const previousQuestions: string[] = [];
  for (const play of pastPlays) {
    try {
      const parsed = JSON.parse(play.result) as { questions?: string[] };
      previousQuestions.push(...(parsed.questions ?? []));
    } catch {
      // ignore malformed rows
    }
  }

  return NextResponse.json({
    questions: pickQuestions(previousQuestions),
    isFirstEver: false,
  });
}
