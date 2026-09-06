import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpStreakForPlay } from "@/lib/streak";
import { awardBadgesForColorTheory, BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { colorTheoryPlaySchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = colorTheoryPlaySchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { color, questions, answers } = parsed.data;
  const questionsAnswered = answers.filter((a) => a.trim().length > 0).length;

  await prisma.gamePlay.create({
    data: {
      userId: user.id,
      game: "COLOR_THEORY",
      result: JSON.stringify({ color, questionsAnswered, totalQuestions: questions.length, questions }),
      score: questionsAnswered,
    },
  });

  const [streak, newBadgeKeys] = await Promise.all([
    bumpStreakForPlay(user.id),
    awardBadgesForColorTheory(user.id, {
      color,
      questionsAnswered,
      totalQuestions: questions.length,
    }),
  ]);

  const newBadges = (newBadgeKeys as BadgeKey[]).map((key) => ({
    key,
    label: BADGE_CATALOG[key].label,
  }));

  return NextResponse.json({ streak: streak.currentCount, newBadges });
}
