import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-response";

export const maxDuration = 30;

/** Everything Happy Space holds about the signed-in person, as one JSON
 * file. The password hash is deliberately left out. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const [gamePlays, badges, journal, moods, streak] = await Promise.all([
    prisma.gamePlay.findMany({ where: { userId: user.id }, orderBy: { playedAt: "asc" } }),
    prisma.userBadge.findMany({ where: { userId: user.id }, orderBy: { earnedAt: "asc" } }),
    prisma.journalEntry.findMany({ where: { userId: user.id }, orderBy: [{ date: "asc" }, { slot: "asc" }] }),
    prisma.moodEntry.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.streak.findUnique({ where: { userId: user.id } }),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    account: {
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
    streak: streak && {
      current: streak.currentCount,
      longest: streak.longestCount,
      lastPlayedDate: streak.lastPlayedDate,
    },
    badges: badges.map((b) => ({ badge: b.badgeKey, earnedAt: b.earnedAt })),
    moods: moods.map((m) => ({ date: m.date, mood: m.mood })),
    journal: journal.map((j) => ({ date: j.date, slot: j.slot, text: j.text })),
    gamePlays: gamePlays.map((g) => ({
      game: g.game,
      playedAt: g.playedAt,
      score: g.score,
      result: safeParse(g.result),
    })),
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="happy-space-my-data.json"',
      "Cache-Control": "no-store",
    },
  });
}

function safeParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
