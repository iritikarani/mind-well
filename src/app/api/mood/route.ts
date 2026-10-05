import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { moodSchema } from "@/lib/validation";
import { todayKeyInZone } from "@/lib/date";
import { getUserTimeZone } from "@/lib/timezone";

export const maxDuration = 30;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const timeZone = await getUserTimeZone();
  const today = todayKeyInZone(timeZone);

  const entry = await prisma.moodEntry.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });

  return NextResponse.json({ mood: entry?.mood ?? null });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = moodSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const timeZone = await getUserTimeZone();
  const today = todayKeyInZone(timeZone);

  const entry = await prisma.moodEntry.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    create: { userId: user.id, date: today, mood: parsed.data.mood },
    update: { mood: parsed.data.mood },
  });

  return NextResponse.json({ mood: entry.mood });
}
