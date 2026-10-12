import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpStreakForPlay } from "@/lib/streak";
import { awardBadgesForWorldPuzzle, BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { worldPuzzlePlaySchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { monumentById, randomQuote } from "@/lib/worldPuzzleContent";
import { hasReachedDailyLimit } from "@/lib/playLimit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  if (await hasReachedDailyLimit(user.id, "WORLD_PUZZLE")) {
    return errorResponse("You've already played World Puzzle today", 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = worldPuzzlePlaySchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const monument = monumentById(parsed.data.monumentId);
  if (!monument) return errorResponse("Unknown monument", 422);

  await prisma.gamePlay.create({
    data: {
      userId: user.id,
      game: "WORLD_PUZZLE",
      result: JSON.stringify({ monumentId: monument.id, country: monument.country }),
      score: 1,
    },
  });

  const [streak, newBadgeKeys] = await Promise.all([
    bumpStreakForPlay(user.id),
    awardBadgesForWorldPuzzle(user.id),
  ]);

  const newBadges = (newBadgeKeys as BadgeKey[]).map((key) => ({
    key,
    label: BADGE_CATALOG[key].label,
  }));

  const limitReached = await hasReachedDailyLimit(user.id, "WORLD_PUZZLE");

  return NextResponse.json({ streak: streak.currentCount, newBadges, quote: randomQuote(), limitReached });
}
