import { prisma } from "@/lib/prisma";
import { todayKeyInZone } from "@/lib/date";
import { getUserTimeZone } from "@/lib/timezone";

function daysBetween(a: string, b: string) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

/** Call once per completed game play. Idempotent per calendar day (in the user's own timezone). */
export async function bumpStreakForPlay(userId: string) {
  const timeZone = await getUserTimeZone();
  const today = todayKeyInZone(timeZone);

  const streak = await prisma.streak.upsert({
    where: { userId },
    create: { userId, currentCount: 1, longestCount: 1, lastPlayedDate: today },
    update: {},
  });

  if (streak.lastPlayedDate === today) {
    return streak;
  }

  const gap = streak.lastPlayedDate ? daysBetween(streak.lastPlayedDate, today) : null;
  const nextCurrent = gap === 1 ? streak.currentCount + 1 : 1;

  return prisma.streak.update({
    where: { userId },
    data: {
      currentCount: nextCurrent,
      longestCount: Math.max(nextCurrent, streak.longestCount),
      lastPlayedDate: today,
    },
  });
}

/** A streak "breaks" if the user's last play was before yesterday. Read-only. */
export function isStreakActive(lastPlayedDate: string | null, timeZone: string) {
  if (!lastPlayedDate) return false;
  const gap = daysBetween(lastPlayedDate, todayKeyInZone(timeZone));
  return gap <= 1;
}

/**
 * Reads the streak for display. `currentCount` in the database only changes
 * on a play, so a user who simply stops playing keeps showing their last
 * count forever unless we check activity here at read time.
 */
export async function getEffectiveStreak(userId: string): Promise<{
  currentCount: number;
  longestCount: number;
}> {
  const timeZone = await getUserTimeZone();
  const streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) return { currentCount: 0, longestCount: 0 };

  const currentCount = isStreakActive(streak.lastPlayedDate, timeZone) ? streak.currentCount : 0;
  return { currentCount, longestCount: streak.longestCount };
}
