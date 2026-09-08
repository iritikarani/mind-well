import { prisma } from "@/lib/prisma";
import { startOfDayInZone } from "@/lib/date";
import { getUserTimeZone } from "@/lib/timezone";
import type { GameKey } from "@/generated/prisma/enums";

/** Games not listed here have no daily cap. */
export const DAILY_PLAY_LIMITS: Partial<Record<GameKey, number>> = {
  WORLD_PUZZLE: 1,
  COLOR_THEORY: 1,
  FIND_THE_WORD: 2,
};

export async function getPlaysToday(userId: string, game: GameKey): Promise<number> {
  const timeZone = await getUserTimeZone();
  const start = startOfDayInZone(timeZone);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return prisma.gamePlay.count({
    where: { userId, game, playedAt: { gte: start, lt: end } },
  });
}

export async function hasReachedDailyLimit(userId: string, game: GameKey): Promise<boolean> {
  const limit = DAILY_PLAY_LIMITS[game];
  if (!limit) return false;
  return (await getPlaysToday(userId, game)) >= limit;
}
