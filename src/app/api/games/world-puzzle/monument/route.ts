import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import { todayKey } from "@/lib/date";
import { MONUMENTS } from "@/lib/worldPuzzleContent";

export const maxDuration = 30;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  // Same puzzle for every signed-in user on a given UTC calendar day —
  // day 0 is monument 0, day 1 is monument 1, and so on. Once the whole
  // list has been used once, the cycle repeats but bumped to a 4x4 grid
  // instead of the first-pass 3x3.
  const dayIndex = Math.floor(new Date(`${todayKey()}T00:00:00.000Z`).getTime() / MS_PER_DAY);
  const isRepeat = dayIndex >= MONUMENTS.length;
  const monument = MONUMENTS[dayIndex % MONUMENTS.length];

  return NextResponse.json({ monumentId: monument.id, gridSize: isRepeat ? 4 : 3 });
}
