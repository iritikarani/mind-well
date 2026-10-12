import { describe, expect, it } from "vitest";
import { BRIGHT_LETTERS, GENTLE_LETTERS, pickLetter } from "./letters";

describe("letters", () => {
  it("every letter has real text and a tiny thing to try", () => {
    for (const l of [...GENTLE_LETTERS, ...BRIGHT_LETTERS]) {
      expect(l.body.length).toBeGreaterThan(40);
      expect(l.tryThis.length).toBeGreaterThan(10);
    }
  });

  it("has no duplicate letters", () => {
    const all = [...GENTLE_LETTERS, ...BRIGHT_LETTERS].map((l) => l.body);
    expect(new Set(all).size).toBe(all.length);
  });

  it("picks from the gentle set on hard days and the bright set otherwise", () => {
    for (const mood of ["Low", "Upset", "Tired", "Unsure"]) {
      expect(GENTLE_LETTERS).toContain(pickLetter("2026-10-12", mood, "u1"));
    }
    for (const mood of ["Happy", "Calm", "Okay", "Neutral", null]) {
      expect(BRIGHT_LETTERS).toContain(pickLetter("2026-10-12", mood, "u1"));
    }
  });

  it("is stable for the same person and day", () => {
    expect(pickLetter("2026-10-12", "Low", "u1")).toBe(pickLetter("2026-10-12", "Low", "u1"));
  });

  it("never repeats on consecutive days, across a whole cycle", () => {
    for (const mood of [null, "Low"]) {
      let prev = pickLetter("2026-01-01", mood, "someone");
      for (let d = 2; d <= 60; d++) {
        const key = `2026-${d <= 31 ? "01" : "02"}-${String(d <= 31 ? d : d - 31).padStart(2, "0")}`;
        const next = pickLetter(key, mood, "someone");
        expect(next).not.toBe(prev);
        prev = next;
      }
    }
  });

  it("steps through every letter before repeating one", () => {
    const seen = new Set<string>();
    for (let d = 1; d <= BRIGHT_LETTERS.length; d++) {
      seen.add(pickLetter(`2026-03-${String(d).padStart(2, "0")}`, null, "x").body);
    }
    expect(seen.size).toBe(BRIGHT_LETTERS.length);
  });
});
