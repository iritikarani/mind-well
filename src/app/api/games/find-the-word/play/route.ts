import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpStreakForPlay } from "@/lib/streak";
import { awardBadgesForFindTheWord, BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { findTheWordPlaySchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = findTheWordPlaySchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { wordsFound } = parsed.data;

  await prisma.gamePlay.create({
    data: {
      userId: user.id,
      game: "FIND_THE_WORD",
      result: JSON.stringify({ wordsFound }),
      score: wordsFound.length,
    },
  });

  const [streak, newBadgeKeys] = await Promise.all([
    bumpStreakForPlay(user.id),
    awardBadgesForFindTheWord(user.id, wordsFound),
  ]);

  const newBadges = (newBadgeKeys as BadgeKey[]).map((key) => ({
    key,
    label: BADGE_CATALOG[key].label,
  }));

  return NextResponse.json({ streak: streak.currentCount, newBadges });
}
