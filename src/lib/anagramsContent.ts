import ANAGRAM_WORDS from "./anagramWords.json";

export interface AcceptedWord {
  word: string;
  uncommon?: boolean;
}

export interface SimplePuzzle {
  source: string;
  accepted: AcceptedWord[];
}

export interface Level3Puzzle {
  source: string;
  accepted4: AcceptedWord[];
  accepted5: AcceptedWord[];
}

/** Level 1: a 4-letter word; player finds two different new 4-letter anagrams of it. */
export const LEVEL1_PUZZLES: SimplePuzzle[] = [
  { source: "LOOP", accepted: [{ word: "POOL" }, { word: "POLO" }] },
  { source: "CARE", accepted: [{ word: "RACE" }, { word: "ACRE", uncommon: true }] },
  { source: "TEAM", accepted: [{ word: "MATE" }, { word: "MEAT" }, { word: "TAME" }] },
  { source: "LIVE", accepted: [{ word: "VEIL" }, { word: "EVIL" }, { word: "VILE" }] },
  { source: "SPAN", accepted: [{ word: "PANS" }, { word: "NAPS" }, { word: "SNAP" }] },
  { source: "LEAP", accepted: [{ word: "PALE" }, { word: "PEAL", uncommon: true }, { word: "PLEA" }] },
  { source: "SILT", accepted: [{ word: "LIST" }, { word: "SLIT" }] },
  { source: "STOP", accepted: [{ word: "SPOT" }, { word: "POTS" }, { word: "TOPS" }, { word: "OPTS" }, { word: "POST" }] },
  { source: "RATE", accepted: [{ word: "TEAR" }, { word: "TARE", uncommon: true }] },
  { source: "EAST", accepted: [{ word: "EATS" }, { word: "SEAT" }, { word: "TEAS" }, { word: "SATE", uncommon: true }] },
];

/** Level 2: a 5-letter word; player finds one new 5-letter anagram of it. */
export const LEVEL2_PUZZLES: SimplePuzzle[] = [
  { source: "STARE", accepted: [{ word: "RATES" }, { word: "TEARS" }, { word: "TARES", uncommon: true }, { word: "ASTER", uncommon: true }] },
  { source: "EARTH", accepted: [{ word: "HEART" }, { word: "HATER" }] },
  { source: "NIGHT", accepted: [{ word: "THING" }] },
  { source: "LEMON", accepted: [{ word: "MELON" }] },
  { source: "STEAM", accepted: [{ word: "MEATS" }, { word: "TEAMS" }, { word: "MATES" }, { word: "TAMES" }] },
  { source: "SPARE", accepted: [{ word: "PARSE" }, { word: "PEARS" }, { word: "REAPS" }] },
  { source: "TONES", accepted: [{ word: "STONE" }, { word: "NOTES" }, { word: "ONSET" }, { word: "STENO", uncommon: true }] },
  { source: "DIETS", accepted: [{ word: "TIDES" }, { word: "EDITS" }, { word: "SITED", uncommon: true }] },
];

/**
 * Level 3: a 6-letter word; player forms one 4-letter word and one 5-letter
 * word drawn from its letters. Each answer is checked independently against
 * the source's letters — they may freely share/reuse letters between them.
 */
export const LEVEL3_PUZZLES: Level3Puzzle[] = [
  {
    source: "GARDEN",
    accepted4: [
      { word: "RANG" }, { word: "DARE" }, { word: "DEAR" }, { word: "READ" }, { word: "RAGE" },
      { word: "GEAR" }, { word: "NEAR" }, { word: "EARN" }, { word: "DRAG" },
    ],
    accepted5: [{ word: "ANGER" }, { word: "RANGE" }, { word: "GRAND" }],
  },
  {
    source: "STREAM",
    accepted4: [
      { word: "MAST" }, { word: "MATE" }, { word: "TEAM" }, { word: "TEAR" }, { word: "TARS", uncommon: true },
      { word: "RATE" }, { word: "STAR" }, { word: "ARTS" }, { word: "EARS" }, { word: "SEAT" },
      { word: "MARE" }, { word: "REST" }, { word: "RATS" },
    ],
    accepted5: [
      { word: "TEAMS" }, { word: "RATES" }, { word: "TEARS" }, { word: "TARES", uncommon: true },
      { word: "STARE" }, { word: "MATES" }, { word: "SMEAR" }, { word: "STEAM" },
    ],
  },
  {
    source: "PLANET",
    accepted4: [
      { word: "PLAN" }, { word: "LEAN" }, { word: "LANE" }, { word: "PALE" }, { word: "PEAL", uncommon: true },
      { word: "PLEA" }, { word: "NEAT" }, { word: "ANTE", uncommon: true }, { word: "PANT" }, { word: "PANE" },
      { word: "PEAT", uncommon: true }, { word: "TALE" }, { word: "TEAL" }, { word: "LATE" },
    ],
    accepted5: [{ word: "PLANE" }, { word: "PLATE" }, { word: "PANEL" }, { word: "PLEAT", uncommon: true }],
  },
  {
    source: "SILENT",
    accepted4: [
      { word: "LENS" }, { word: "TENS" }, { word: "NEST" }, { word: "LEST" }, { word: "LINT" },
      { word: "TILE" }, { word: "LITE" }, { word: "SENT" }, { word: "LIEN", uncommon: true }, { word: "NITS" },
    ],
    accepted5: [{ word: "TINES", uncommon: true }, { word: "LIENS", uncommon: true }],
  },
  {
    source: "ORANGE",
    accepted4: [
      { word: "ROAN", uncommon: true }, { word: "RANG" }, { word: "GEAR" }, { word: "RAGE" }, { word: "NEAR" },
      { word: "EARN" }, { word: "GONE" }, { word: "GORE" }, { word: "AEON", uncommon: true },
    ],
    accepted5: [{ word: "ORGAN" }, { word: "RANGE" }, { word: "GROAN" }],
  },
];

function normalize(word: string): string {
  return word.trim().toUpperCase();
}

function letterCounts(word: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const letter of word) {
    counts[letter] = (counts[letter] ?? 0) + 1;
  }
  return counts;
}

function isExactAnagram(answer: string, source: string): boolean {
  const a = normalize(answer);
  const s = normalize(source);
  if (a.length !== s.length || a === s) return false;

  const aCounts = letterCounts(a);
  const sCounts = letterCounts(s);
  const letters = new Set([...Object.keys(aCounts), ...Object.keys(sCounts)]);
  return [...letters].every((l) => (aCounts[l] ?? 0) === (sCounts[l] ?? 0));
}

function isSubsetOf(answer: string, source: string): boolean {
  const a = normalize(answer);
  const s = normalize(source);
  const aCounts = letterCounts(a);
  const sCounts = letterCounts(s);
  return Object.entries(aCounts).every(([letter, count]) => count <= (sCounts[letter] ?? 0));
}

export interface CheckResult {
  valid: boolean;
  uncommon: boolean;
}

/** Full 4-6 letter English dictionary, used so any real word made from the
 * puzzle's letters is accepted rather than only ones we thought to list. */
const DICTIONARY: ReadonlySet<string> = new Set(ANAGRAM_WORDS);

/** Words already curated (and not flagged `uncommon`) across the puzzle
 * lists below, used only to keep the "found an uncommon word" badge
 * working — anything else that's dictionary-valid defaults to uncommon. */
const COMMON_WORDS: ReadonlySet<string> = new Set(
  [...LEVEL1_PUZZLES.flatMap((p) => p.accepted), ...LEVEL2_PUZZLES.flatMap((p) => p.accepted)]
    .concat(LEVEL3_PUZZLES.flatMap((p) => [...p.accepted4, ...p.accepted5]))
    .filter((a) => !a.uncommon)
    .map((a) => a.word),
);

function checkWord(answer: string, validShape: boolean): CheckResult {
  if (!validShape) return { valid: false, uncommon: false };
  const word = normalize(answer);
  if (!DICTIONARY.has(word)) return { valid: false, uncommon: false };
  return { valid: true, uncommon: !COMMON_WORDS.has(word) };
}

export function checkAnagramAnswer(answer: string, puzzle: SimplePuzzle): CheckResult {
  return checkWord(answer, isExactAnagram(answer, puzzle.source));
}

export function checkLevel3Answer(
  answer: string,
  puzzle: Level3Puzzle,
  length: 4 | 5,
): CheckResult {
  const shapeOk = normalize(answer).length === length && isSubsetOf(answer, puzzle.source);
  return checkWord(answer, shapeOk);
}

export function sameWord(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

/**
 * Picks a puzzle from `pool`, avoiding whichever sources were played most
 * recently (most-recent-first in `recentSources`) so a player cycles through
 * every puzzle in a level before any repeat. Never excludes the whole pool.
 */
export function pickNextPuzzle<T extends { source: string }>(
  pool: T[],
  recentSources: string[],
): T {
  const excludeCount = Math.min(pool.length - 1, recentSources.length);
  const excluded = new Set(recentSources.slice(0, excludeCount));
  const candidates = pool.filter((p) => !excluded.has(p.source));
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function anagramsClosingRemark(totalTimeMs: number, usedUncommon: boolean): string {
  const fast = totalTimeMs < 90_000;

  if (fast && usedUncommon) {
    return "Quick and clever — that's a rare combination of speed and wordplay.";
  }
  if (fast) {
    return "You moved through those letters fast. Your mind likes a good puzzle.";
  }
  if (usedUncommon) {
    return "You took your time, but look what you found — a real gem of a word.";
  }
  return "You worked through every letter, one word at a time. That's real, patient thinking.";
}
