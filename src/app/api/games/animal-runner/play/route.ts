import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bumpStreakForPlay } from "@/lib/streak";
import { awardBadgesForAnimalRunner, BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

const schema = z.object({
  survived: z.boolean(),
  heartsRemaining: z.number().int().min(0).max(10),
  positiveAbsorbed: z.number().int().min(0),
  negativeAbsorbed: z.number().int().min(0),
  positiveDodged: z.number().int().min(0),
  negativeDodged: z.number().int().min(0),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const result = parsed.data;
  const score = result.positiveAbsorbed - result.negativeAbsorbed + result.heartsRemaining;

  await prisma.gamePlay.create({
    data: {
      userId: user.id,
      game: "ANIMAL_RUNNER",
      result: JSON.stringify(result),
      score,
    },
  });

  const [streak, newBadgeKeys] = await Promise.all([
    bumpStreakForPlay(user.id),
    awardBadgesForAnimalRunner(user.id, result),
  ]);

  const newBadges = (newBadgeKeys as BadgeKey[]).map((key) => ({
    key,
    label: BADGE_CATALOG[key].label,
  }));

  return NextResponse.json({ streak: streak.currentCount, newBadges });
}
