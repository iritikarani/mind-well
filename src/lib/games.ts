import type { GameKey } from "@/generated/prisma/enums";

export interface GameMeta {
  key: GameKey;
  label: string;
  category: string;
  emoji: string;
  href: string;
  tagline: string;
  playable: boolean;
}

export const GAME_CATEGORIES = ["Validation?", "Threads", "Mind Flow", "3 Things"] as const;

export const CATEGORY_META: Record<
  (typeof GAME_CATEGORIES)[number],
  { tagline: string; tone: "blush" | "sky" | "peach" | "mint" }
> = {
  "Validation?": { tagline: "Play • Reflect • Validate", tone: "blush" },
  Threads: { tagline: "Connect • Discover • Think", tone: "sky" },
  "Mind Flow": { tagline: "Challenge • Create • Explore", tone: "peach" },
  "3 Things": { tagline: "Remember • Reflect • Keep", tone: "mint" },
};

export const GAMES: GameMeta[] = [
  {
    key: "ANIMAL_RUNNER",
    label: "Animal Runner",
    category: "Validation?",
    emoji: "🦊",
    href: "/games/animal-runner",
    tagline: "Choose a companion and jump or duck past thoughts as you run.",
    playable: true,
  },
  {
    key: "WORLD_PUZZLE",
    label: "World Puzzle",
    category: "Validation?",
    emoji: "🧩",
    href: "/games/world-puzzle",
    tagline: "Piece together a destination from around the world, postcard by postcard.",
    playable: true,
  },
  {
    key: "COLOR_THEORY",
    label: "Color Connection",
    category: "Validation?",
    emoji: "🎨",
    href: "/games/color-theory",
    tagline: "Pick a color, reflect a little, leave with a keepsake badge.",
    playable: true,
  },
  {
    key: "SPIN_AND_CONNECT",
    label: "Spin & Connect",
    category: "Threads",
    emoji: "🎡",
    href: "/games/spin-and-connect",
    tagline: "Spin a letter and a category, then connect the dots.",
    playable: true,
  },
  {
    key: "FIND_THE_WORD",
    label: "Find the Word",
    category: "Threads",
    emoji: "🔤",
    href: "/games/find-the-word",
    tagline: "Find a few words, answer a few gentle questions.",
    playable: true,
  },
  {
    key: "ANAGRAMS",
    label: "Anagrams",
    category: "Mind Flow",
    emoji: "🔀",
    href: "/games/anagrams",
    tagline: "Rearrange letters into new words across three levels.",
    playable: true,
  },
  {
    key: "THREE_THINGS",
    label: "Journal",
    category: "3 Things",
    emoji: "📓",
    href: "/games/three-things",
    tagline: "Jot down up to three things, any day, no pressure.",
    playable: true,
  },
];

export function gameMeta(key: GameKey) {
  return GAMES.find((g) => g.key === key);
}

/** Stable anchor id for a category, e.g. "Mind Flow" -> "mind-flow". */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
