import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import { awardBadgeDirect, BADGE_CATALOG } from "@/lib/badges";

export const maxDuration = 30;

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const newBadgeKeys = await awardBadgeDirect(user.id, "MONTHLY_KEEPER");
  const newBadges = newBadgeKeys.map((key) => ({ key, label: BADGE_CATALOG[key].label }));

  return NextResponse.json({ newBadges });
}
