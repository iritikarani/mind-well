import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  LETTERS,
  WORDBANK,
  getHint,
  isValidAnswer,
  tierFor,
  type CategoryKey,
} from "./spinConnectContent";
import { LEVEL1_PUZZLES, LEVEL2_PUZZLES, LEVEL3_PUZZLES } from "./anagramsContent";
import { MONUMENTS } from "./worldPuzzleContent";

describe("Spin & Connect categories", () => {
  it("is exactly the ten chosen categories", () => {
    expect(CATEGORIES.map((c) => c.key)).toEqual([
      "fruits",
      "vegetables",
      "flowers",
      "colors",
      "animals",
      "birds",
      "countries",
      "sports",
      "household",
      "bollywood",
    ]);
  });

  it("every category has a word bank, and a label/emoji for the wheel", () => {
    for (const c of CATEGORIES) {
      expect(WORDBANK[c.key as CategoryKey].length).toBeGreaterThan(40);
      expect(c.label.length).toBeGreaterThan(2);
      expect(c.emoji.length).toBeGreaterThan(0);
    }
  });

  it("word banks have no duplicates", () => {
    for (const c of CATEGORIES) {
      const words = WORDBANK[c.key as CategoryKey].map((w) => w.toLowerCase());
      expect(new Set(words).size, c.key).toBe(words.length);
    }
  });

  it("every letter on the wheel can land on a category that has an answer", () => {
    for (const letter of LETTERS) {
      const playable = CATEGORIES.some((c) => tierFor(c.key as CategoryKey, letter).tier !== "none");
      expect(playable, letter).toBe(true);
    }
  });

  it("Bollywood Hits has an answer for every letter on the wheel", () => {
    for (const letter of LETTERS) {
      expect(tierFor("bollywood", letter).tier, letter).not.toBe("none");
    }
  });

  it("every combination asks for exactly one answer or is skippable", () => {
    for (const c of CATEGORIES) {
      for (const letter of LETTERS) {
        const t = tierFor(c.key as CategoryKey, letter);
        expect([0, 1]).toContain(t.required);
      }
    }
  });
});

describe("answer checking", () => {
  it("accepts a correct answer in any case, ignoring surrounding spaces", () => {
    expect(isValidAnswer("fruits", "M", "mango")).toBe(true);
    expect(isValidAnswer("fruits", "M", "  MANGO ")).toBe(true);
  });
  it("forgives a small typo but not a different word", () => {
    expect(isValidAnswer("vegetables", "B", "Brocolli")).toBe(true);
    expect(isValidAnswer("fruits", "M", "mongoose")).toBe(false);
  });
  it("rejects blanks and the wrong letter", () => {
    expect(isValidAnswer("fruits", "M", "")).toBe(false);
    expect(isValidAnswer("fruits", "A", "mango")).toBe(false);
  });
  it("Bollywood answers are the title with no spaces", () => {
    expect(isValidAnswer("bollywood", "D", "Dangal")).toBe(true);
    expect(isValidAnswer("bollywood", "R", "rangdebasanti")).toBe(true);
  });
  it("a hint is a real answer for that letter, and skips ones already used", () => {
    const hint = getHint("animals", "L", [])!;
    expect(hint[0].toUpperCase()).toBe("L");
    expect(isValidAnswer("animals", "L", hint)).toBe(true);
    const all = WORDBANK.animals.filter((w) => w[0].toUpperCase() === "L");
    expect(getHint("animals", "L", all)).toBeNull();
  });
});

describe("Anagrams", () => {
  const letters = (s: string) => s.toUpperCase().split("").sort().join("");

  it("Level 1 and 2: every accepted word really is an anagram of the source", () => {
    for (const p of [...LEVEL1_PUZZLES, ...LEVEL2_PUZZLES]) {
      for (const a of p.accepted) {
        expect(letters(a.word), `${p.source} -> ${a.word}`).toBe(letters(p.source));
      }
    }
  });

  it("Level 3: a 6-letter source that makes one 4-letter and one 5-letter word", () => {
    expect(LEVEL3_PUZZLES.length).toBeGreaterThanOrEqual(5);
    for (const p of LEVEL3_PUZZLES) {
      expect(p.source.length, p.source).toBe(6);
      expect(p.accepted4.length, p.source).toBeGreaterThan(0);
      expect(p.accepted5.length, p.source).toBeGreaterThan(0);
      for (const w of p.accepted4) expect(w.word.length).toBe(4);
      for (const w of p.accepted5) expect(w.word.length).toBe(5);
    }
  });
});

describe("World Puzzle monuments", () => {
  const pub = path.resolve(__dirname, "../../public");

  it("ids are unique", () => {
    const ids = MONUMENTS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every monument has its photo and the thumbnail the room wall uses", () => {
    const missing: string[] = [];
    for (const m of MONUMENTS) {
      if (!fs.existsSync(path.join(pub, m.image))) missing.push(m.image);
      if (m.image !== `/monuments/${m.id}.jpg`) missing.push(`id/file mismatch: ${m.id}`);
      if (!fs.existsSync(path.join(pub, "monuments", "thumbs", `${m.id}.jpg`))) missing.push(`thumb:${m.id}`);
    }
    expect(missing).toEqual([]);
  });

  it("photos are kept light (under 400KB each)", () => {
    const heavy = MONUMENTS.filter(
      (m) => fs.statSync(path.join(pub, m.image)).size > 400 * 1024,
    ).map((m) => m.id);
    expect(heavy).toEqual([]);
  });
});
