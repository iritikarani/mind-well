export type ColorKey =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "brown"
  | "black"
  | "white";

export interface ColorDef {
  key: ColorKey;
  label: string;
  hex: string;
  textHex: string;
  border?: boolean;
  affirmation: string;
}

export const COLORS: ColorDef[] = [
  { key: "red", label: "Red", hex: "#E4572E", textHex: "#FFFFFF", affirmation: "You are as bold as red." },
  { key: "orange", label: "Orange", hex: "#F4A259", textHex: "#5A3312", affirmation: "You are as vibrant as orange." },
  { key: "yellow", label: "Yellow", hex: "#F6C445", textHex: "#5A4A0E", affirmation: "You are as bright as yellow." },
  { key: "green", label: "Green", hex: "#6A994E", textHex: "#FFFFFF", affirmation: "You are as grounded as green." },
  { key: "blue", label: "Blue", hex: "#4A7FB5", textHex: "#FFFFFF", affirmation: "You are as calm as blue." },
  { key: "purple", label: "Purple", hex: "#9B5DE5", textHex: "#FFFFFF", affirmation: "You are as unique as purple." },
  { key: "pink", label: "Pink", hex: "#F49CBB", textHex: "#7A3B57", affirmation: "You are as soft as pink." },
  { key: "brown", label: "Brown", hex: "#8B5E3C", textHex: "#FFFFFF", affirmation: "You are as steady as brown." },
  { key: "black", label: "Black", hex: "#2B2B2B", textHex: "#FFFFFF", affirmation: "You are as strong as black." },
  { key: "white", label: "White", hex: "#F7F5F0", textHex: "#6B5B73", border: true, affirmation: "You are as peaceful as white." },
];

export function colorByKey(key: string): ColorDef {
  return COLORS.find((c) => c.key === key) ?? COLORS[0];
}

export const FIRST_TIME_QUESTIONS: string[] = [
  "Why do you like this color?",
  "What does this color remind you of?",
  "Where do you see this color most often?",
  "What mood does this color give you?",
  "What season feels like this color?",
  "What's one memory tied to this color?",
  "What does this color make you want to do?",
];

const QUESTION_TEMPLATES: string[] = [
  "What {subject} does this color remind you of?",
  "If this color were a {subject}, what would it be?",
  "What {subject} comes to mind first?",
  "Which {subject} matches this color best?",
  "What {subject} feels like this color?",
  "Describe a {subject} that fits this color.",
  "What {subject} would you pair with this color?",
  "Name a {subject} this color brings to mind.",
  "What {subject} does this color capture?",
  "If you had to pick one {subject} for this color, what would it be?",
  "What {subject} best represents this color to you?",
  "Which {subject} feels closest to this color?",
  "What {subject} would this color choose, if it could?",
  "Think of a {subject} — does this color fit it?",
  "What {subject} would you associate with this color today?",
  "If this color had a {subject}, what would it be?",
  "What {subject} does this color quietly hold?",
  "Which {subject} would this color become?",
  "What {subject} lingers when you look at this color?",
  "What {subject} would you gift this color?",
];

const SUBJECTS: string[] = [
  "season",
  "memory",
  "sound",
  "smell",
  "animal",
  "place",
  "texture",
  "mood",
  "food",
  "song",
  "word",
  "time of day",
  "weather",
  "flower",
  "fabric",
  "drink",
  "shape",
  "feeling",
  "person",
  "moment",
  "taste",
  "gesture",
  "dream",
  "room",
  "plant",
  "instrument",
  "gemstone",
  "dessert",
  "holiday",
  "motion",
  "scent",
  "hour",
  "chapter",
  "letter",
  "name",
  "story",
  "ritual",
  "spice",
  "cloud",
  "path",
  "doorway",
  "melody",
  "whisper",
  "habit",
  "keepsake",
  "landscape",
  "breath",
  "pairing",
  "morning",
  "night",
];

let cachedPool: string[] | null = null;

/** 20 templates x 50 subjects = 1000 unique reflective questions. */
export function questionPool(): string[] {
  if (cachedPool) return cachedPool;
  const pool: string[] = [];
  for (const template of QUESTION_TEMPLATES) {
    for (const subject of SUBJECTS) {
      pool.push(template.replace("{subject}", subject));
    }
  }
  cachedPool = pool;
  return pool;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Picks `count` fresh questions, avoiding previously-asked ones where possible.
 *  Explicitly deduplicates so the same question can never appear twice in one set. */
export function pickQuestions(previous: string[] = [], count = 7): string[] {
  const pool = questionPool();
  const previousSet = new Set(previous);
  const fresh = pool.filter((q) => !previousSet.has(q));
  const source = fresh.length >= count ? fresh : pool;

  const picked: string[] = [];
  const seen = new Set<string>();
  for (const q of shuffle(source)) {
    if (seen.has(q)) continue;
    seen.add(q);
    picked.push(q);
    if (picked.length === count) break;
  }
  return picked;
}
