import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpStreakForPlay } from "@/lib/streak";
import { awardBadgesForSpinAndConnect, BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { spinAndConnectPlaySchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = spinAndConnectPlaySchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { rounds } = parsed.data;
  const totalCorrect = rounds.reduce((sum, r) => sum + r.correctCount, 0);
  const totalPossible = rounds.reduce((sum, r) => sum + (r.tier === "rare" ? 1 : r.tier === "medium" ? 2 : 3), 0);

  await prisma.gamePlay.create({
    data: {
      userId: user.id,
      game: "SPIN_AND_CONNECT",
      result: JSON.stringify({ rounds, totalCorrect, totalPossible }),
      score: totalCorrect,
    },
  });

  const [streak, newBadgeKeys] = await Promise.all([
    bumpStreakForPlay(user.id),
    awardBadgesForSpinAndConnect(user.id, rounds),
  ]);

  const newBadges = (newBadgeKeys as BadgeKey[]).map((key) => ({
    key,
    label: BADGE_CATALOG[key].label,
  }));

  return NextResponse.json({ streak: streak.currentCount, newBadges });
}
