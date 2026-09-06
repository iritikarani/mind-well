import { prisma } from "@/lib/prisma";
import type { GameKey } from "@/generated/prisma/enums";

export const BADGE_CATALOG = {
  // Animal Runner
  POSITIVITY_MAGNET: {
    label: "Positivity Magnet",
    description: "Absorbed mostly positive remarks in a single run",
    game: "ANIMAL_RUNNER" as GameKey,
  },
  CLEAN_DODGE: {
    label: "Clean Dodge",
    description: "Avoided a high percentage of negative remarks",
    game: "ANIMAL_RUNNER" as GameKey,
  },
  SURVIVOR: {
    label: "Survivor",
    description: "Survived the full 2 minutes",
    game: "ANIMAL_RUNNER" as GameKey,
  },

  // World Puzzle
  PATIENT_BUILDER: {
    label: "Patient Builder",
    description: "Completed a puzzle",
    game: "WORLD_PUZZLE" as GameKey,
  },
  WORLD_TRAVELER: {
    label: "World Traveler",
    description: "Completed puzzles of monuments from 5+ different countries",
    game: "WORLD_PUZZLE" as GameKey,
  },
  QUOTE_COLLECTOR: {
    label: "Quote Collector",
    description: "Flipped and viewed 10 puzzle quotes total",
    game: "WORLD_PUZZLE" as GameKey,
  },

  // Color Theory
  COLOR_CONNECTOR: {
    label: "Color Connector",
    description: "Completed all 7 questions in a session",
    game: "COLOR_THEORY" as GameKey,
  },
  COLOR_WHISPERER: {
    label: "Color Whisperer",
    description: "Played the same color 5+ times",
    game: "COLOR_THEORY" as GameKey,
  },
  RAINBOW_MIND: {
    label: "Rainbow Mind",
    description: "Played every color at least once",
    game: "COLOR_THEORY" as GameKey,
  },

  // Spin and Connect
  QUICK_THINKER: {
    label: "Quick Thinker",
    description: "Completed a round with zero hints used",
    game: "SPIN_AND_CONNECT" as GameKey,
  },
  WORDSMITH: {
    label: "Wordsmith",
    description: "Gave 5 correct answers in one common-category round",
    game: "SPIN_AND_CONNECT" as GameKey,
  },
  FIVE_ROUNDS_STRONG: {
    label: "Five Rounds Strong",
    description: "Completed a full 5-round session",
    game: "SPIN_AND_CONNECT" as GameKey,
  },

  // Find the Word
  SELF_AWARE: {
    label: "Self-Aware",
    description: "Completed a full 3-word session",
    game: "FIND_THE_WORD" as GameKey,
  },
  HONEST_VOICE: {
    label: "Honest Voice",
    description: "Answered all 3 reflective questions",
    game: "FIND_THE_WORD" as GameKey,
  },
  RETURN_VISITOR: {
    label: "Return Visitor",
    description: "Played the game 5+ times",
    game: "FIND_THE_WORD" as GameKey,
  },

  // Anagrams
  SPEED_SOLVER: {
    label: "Speed Solver",
    description: "Completed all 3 levels quickly",
    game: "ANAGRAMS" as GameKey,
  },
  WORDPLAY_GENIUS: {
    label: "Wordplay Genius",
    description: "Formed an uncommon/unique word",
    game: "ANAGRAMS" as GameKey,
  },
  LEVEL_MASTER: {
    label: "Level Master",
    description: "Completed Level 3",
    game: "ANAGRAMS" as GameKey,
  },

  // Three Things
  REFLECTOR: {
    label: "Reflector",
    description: "Saved entries on 7 different days",
    game: "THREE_THINGS" as GameKey,
  },
  FULL_HOUSE: {
    label: "Full House",
    description: "Saved all 3 things on a single date",
    game: "THREE_THINGS" as GameKey,
  },
  MONTHLY_KEEPER: {
    label: "Monthly Keeper",
    description: "Downloaded a full month's PDF",
    game: "THREE_THINGS" as GameKey,
  },

  // Cross-game
  EXPLORER: {
    label: "Explorer",
    description: "Played all 7 games at least once",
    game: null,
  },
  STREAK_KEEPER: {
    label: "Streak Keeper",
    description: "7-day streak",
    game: null,
  },
  CENTURY_CLUB: {
    label: "Century Club",
    description: "100 total game plays",
    game: null,
  },
} as const;

export type BadgeKey = keyof typeof BADGE_CATALOG;

export const ALL_GAME_KEYS: GameKey[] = [
  "ANIMAL_RUNNER",
  "WORLD_PUZZLE",
  "COLOR_THEORY",
  "SPIN_AND_CONNECT",
  "FIND_THE_WORD",
  "ANAGRAMS",
  "THREE_THINGS",
];

export interface AnimalRunnerResult {
  survived: boolean;
  heartsRemaining: number;
  positiveAbsorbed: number;
  negativeAbsorbed: number;
  positiveDodged: number;
  negativeDodged: number;
}

export interface ThreeThingsResult {
  date: string;
  entriesCount: number;
}

export interface ColorTheoryResult {
  color: string;
  questionsAnswered: number;
  totalQuestions: number;
}

const ALL_COLOR_KEYS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
  "black",
  "white",
];

async function grant(userId: string, keys: BadgeKey[]) {
  if (keys.length === 0) return [] as BadgeKey[];

  const existing = await prisma.userBadge.findMany({
    where: { userId, badgeKey: { in: keys } },
    select: { badgeKey: true },
  });
  const existingKeys = new Set(existing.map((b) => b.badgeKey));
  const newKeys = keys.filter((k) => !existingKeys.has(k));

  if (newKeys.length > 0) {
    await prisma.userBadge.createMany({
      data: newKeys.map((badgeKey) => ({ userId, badgeKey })),
    });
  }

  return newKeys;
}

async function evaluateCrossGame(userId: string): Promise<BadgeKey[]> {
  const earned: BadgeKey[] = [];

  const [distinctGames, totalPlays, streak] = await Promise.all([
    prisma.gamePlay.findMany({
      where: { userId },
      distinct: ["game"],
      select: { game: true },
    }),
    prisma.gamePlay.count({ where: { userId } }),
    prisma.streak.findUnique({ where: { userId } }),
  ]);

  if (distinctGames.length >= ALL_GAME_KEYS.length) earned.push("EXPLORER");
  if (totalPlays >= 100) earned.push("CENTURY_CLUB");
  if (streak && streak.currentCount >= 7) earned.push("STREAK_KEEPER");

  return earned;
}

async function evaluateAnimalRunner(result: AnimalRunnerResult): Promise<BadgeKey[]> {
  const earned: BadgeKey[] = [];

  if (result.survived) earned.push("SURVIVOR");
  if (result.positiveAbsorbed > result.negativeAbsorbed) earned.push("POSITIVITY_MAGNET");

  const totalNegative = result.negativeAbsorbed + result.negativeDodged;
  if (totalNegative >= 5 && result.negativeDodged / totalNegative >= 0.8) {
    earned.push("CLEAN_DODGE");
  }

  return earned;
}

async function evaluateThreeThings(userId: string, result: ThreeThingsResult): Promise<BadgeKey[]> {
  const earned: BadgeKey[] = [];

  if (result.entriesCount >= 3) earned.push("FULL_HOUSE");

  const distinctDates = await prisma.journalEntry.findMany({
    where: { userId },
    distinct: ["date"],
    select: { date: true },
  });
  if (distinctDates.length >= 7) earned.push("REFLECTOR");

  return earned;
}

async function evaluateColorTheory(userId: string, result: ColorTheoryResult): Promise<BadgeKey[]> {
  const earned: BadgeKey[] = [];

  if (result.questionsAnswered >= result.totalQuestions) earned.push("COLOR_CONNECTOR");

  // Assumes the current session's GamePlay row has already been created,
  // so it's naturally included in this count.
  const plays = await prisma.gamePlay.findMany({
    where: { userId, game: "COLOR_THEORY" },
    select: { result: true },
  });

  const colorCounts = new Map<string, number>();
  for (const play of plays) {
    try {
      const parsed = JSON.parse(play.result) as { color?: string };
      if (parsed.color) {
        colorCounts.set(parsed.color, (colorCounts.get(parsed.color) ?? 0) + 1);
      }
    } catch {
      // ignore malformed rows
    }
  }

  if ((colorCounts.get(result.color) ?? 0) >= 5) earned.push("COLOR_WHISPERER");
  if (ALL_COLOR_KEYS.every((c) => colorCounts.has(c))) earned.push("RAINBOW_MIND");

  return earned;
}

export async function awardBadgesForAnimalRunner(userId: string, result: AnimalRunnerResult) {
  const [gameBadges, crossGameBadges] = await Promise.all([
    evaluateAnimalRunner(result),
    evaluateCrossGame(userId),
  ]);
  return grant(userId, [...gameBadges, ...crossGameBadges]);
}

export async function awardBadgesForThreeThings(userId: string, result: ThreeThingsResult) {
  const [gameBadges, crossGameBadges] = await Promise.all([
    evaluateThreeThings(userId, result),
    evaluateCrossGame(userId),
  ]);
  return grant(userId, [...gameBadges, ...crossGameBadges]);
}

export async function awardBadgesForColorTheory(userId: string, result: ColorTheoryResult) {
  const [gameBadges, crossGameBadges] = await Promise.all([
    evaluateColorTheory(userId, result),
    evaluateCrossGame(userId),
  ]);
  return grant(userId, [...gameBadges, ...crossGameBadges]);
}

export async function awardBadgeDirect(userId: string, key: BadgeKey) {
  return grant(userId, [key]);
}
