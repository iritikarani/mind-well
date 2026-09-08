import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpStreakForPlay } from "@/lib/streak";
import { awardBadgesForAnagrams, BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { anagramsPlaySchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = anagramsPlaySchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { totalTimeMs, usedUncommonWord, sources } = parsed.data;

  await prisma.gamePlay.create({
    data: {
      userId: user.id,
      game: "ANAGRAMS",
      result: JSON.stringify({ totalTimeMs, usedUncommonWord, sources }),
      score: usedUncommonWord ? 1 : 0,
    },
  });

  const [streak, newBadgeKeys] = await Promise.all([
    bumpStreakForPlay(user.id),
    awardBadgesForAnagrams(user.id, { totalTimeMs, usedUncommonWord }),
  ]);

  const newBadges = (newBadgeKeys as BadgeKey[]).map((key) => ({
    key,
    label: BADGE_CATALOG[key].label,
  }));

  return NextResponse.json({ streak: streak.currentCount, newBadges });
}
