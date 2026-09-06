import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { journalSaveSchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { isPastOrToday, todayKey } from "@/lib/date";
import { bumpStreakForPlay } from "@/lib/streak";
import { awardBadgesForThreeThings, BADGE_CATALOG, type BadgeKey } from "@/lib/badges";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return errorResponse("A valid date is required", 422);
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id, date },
    orderBy: { slot: "asc" },
  });

  return NextResponse.json({ entries });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = journalSaveSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { date, slot, text } = parsed.data;
  if (!isPastOrToday(date)) {
    return errorResponse("You can only journal for today or past dates", 422);
  }

  const trimmed = text.trim();

  if (trimmed.length === 0) {
    await prisma.journalEntry.deleteMany({
      where: { userId: user.id, date, slot },
    });
  } else {
    await prisma.journalEntry.upsert({
      where: { userId_date_slot: { userId: user.id, date, slot } },
      create: { userId: user.id, date, slot, text: trimmed },
      update: { text: trimmed },
    });
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id, date },
    orderBy: { slot: "asc" },
  });

  let newBadges: { key: BadgeKey; label: string }[] = [];
  let streakCount: number | undefined;

  if (entries.length > 0) {
    const [streak, newBadgeKeys] = await Promise.all([
      date === todayKey() ? bumpStreakForPlay(user.id) : null,
      awardBadgesForThreeThings(user.id, { date, entriesCount: entries.length }),
    ]);
    streakCount = streak?.currentCount;
    newBadges = (newBadgeKeys as BadgeKey[]).map((key) => ({ key, label: BADGE_CATALOG[key].label }));

    await prisma.gamePlay.upsert({
      where: { id: `three-things-${user.id}-${date}` },
      create: {
        id: `three-things-${user.id}-${date}`,
        userId: user.id,
        game: "THREE_THINGS",
        result: JSON.stringify({ date, entriesCount: entries.length }),
        score: entries.length,
      },
      update: {
        result: JSON.stringify({ date, entriesCount: entries.length }),
        score: entries.length,
      },
    });
  }

  return NextResponse.json({ entries, newBadges, streak: streakCount });
}
