import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import { dayIndexOf, todayKeyInZone } from "@/lib/date";
import { getUserTimeZone } from "@/lib/timezone";
import { MONUMENTS } from "@/lib/worldPuzzleContent";

export const maxDuration = 30;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  // The puzzle is keyed off the calendar date itself, not a shared real-time
  // instant — so everyone whose local date reads e.g. "Sep 8" gets the same
  // monument, even though "Sep 8" starts and ends at a different real-world
  // moment in each timezone, and each user's puzzle still changes over at
  // their own local midnight. Once the day-index passes the full list
  // length the cycle repeats, bumped to a 4x4 grid instead of the
  // first-pass 3x3.
  const timeZone = await getUserTimeZone();
  const dayIndex = dayIndexOf(todayKeyInZone(timeZone));
  const isRepeat = dayIndex >= MONUMENTS.length;
  const monument = MONUMENTS[dayIndex % MONUMENTS.length];

  return NextResponse.json({ monumentId: monument.id, gridSize: isRepeat ? 4 : 3 });
}
