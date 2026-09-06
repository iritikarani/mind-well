import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/date";

function daysBetween(a: string, b: string) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

/** Call once per completed game play. Idempotent per calendar day. */
export async function bumpStreakForPlay(userId: string) {
  const today = todayKey();

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
export function isStreakActive(lastPlayedDate: string | null) {
  if (!lastPlayedDate) return false;
  const gap = daysBetween(lastPlayedDate, todayKey());
  return gap <= 1;
}
