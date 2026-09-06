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

export const GAME_CATEGORIES = ["Validation", "Threads", "Mind Flow", "Three Things"] as const;

export const GAMES: GameMeta[] = [
  {
    key: "ANIMAL_RUNNER",
    label: "Animal Runner",
    category: "Validation",
    emoji: "🦊",
    href: "/games/animal-runner",
    tagline: "Choose a companion and let good remarks in, let the rest run past you.",
    playable: true,
  },
  {
    key: "WORLD_PUZZLE",
    label: "World Puzzle",
    category: "Validation",
    emoji: "🧩",
    href: "/games/world-puzzle",
    tagline: "Piece together a monument from around the world, at your own pace.",
    playable: false,
  },
  {
    key: "COLOR_THEORY",
    label: "Color Theory",
    category: "Validation",
    emoji: "🎨",
    href: "/games/color-theory",
    tagline: "Pick a color, reflect a little, leave with an affirmation.",
    playable: false,
  },
  {
    key: "SPIN_AND_CONNECT",
    label: "Spin and Connect",
    category: "Threads",
    emoji: "🎡",
    href: "/games/spin-and-connect",
    tagline: "Spin a letter and a category, then connect the dots.",
    playable: false,
  },
  {
    key: "FIND_THE_WORD",
    label: "Find the Word",
    category: "Threads",
    emoji: "🔤",
    href: "/games/find-the-word",
    tagline: "Find a few words, answer a few gentle questions.",
    playable: false,
  },
  {
    key: "ANAGRAMS",
    label: "Anagrams",
    category: "Mind Flow",
    emoji: "🔀",
    href: "/games/anagrams",
    tagline: "Rearrange letters into new words across three levels.",
    playable: false,
  },
  {
    key: "THREE_THINGS",
    label: "Three Things",
    category: "Three Things",
    emoji: "📓",
    href: "/games/three-things",
    tagline: "Jot down up to three things, any day, no pressure.",
    playable: true,
  },
];

export function gameMeta(key: GameKey) {
  return GAMES.find((g) => g.key === key);
}
