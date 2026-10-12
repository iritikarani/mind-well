import { describe, expect, it } from "vitest";
import { BREATH_PATTERNS, cycleSeconds, phaseAt } from "./breathing";

const soft = BREATH_PATTERNS.find((p) => p.id === "soft")!;
const box = BREATH_PATTERNS.find((p) => p.id === "box")!;

describe("breathing", () => {
  it("cycle lengths add up", () => {
    expect(cycleSeconds(soft)).toBe(10);
    expect(cycleSeconds(box)).toBe(16);
    expect(cycleSeconds(BREATH_PATTERNS.find((p) => p.id === "sleep")!)).toBe(19);
  });

  it("starts empty, is full at the top of the in-breath, and empties again", () => {
    expect(phaseAt(soft, 0).kind).toBe("in");
    expect(phaseAt(soft, 0).scale).toBeCloseTo(0.55, 2);
    expect(phaseAt(soft, 3.999).scale).toBeGreaterThan(0.99);
    expect(phaseAt(soft, 4).kind).toBe("out");
    expect(phaseAt(soft, 4).scale).toBeCloseTo(1, 2);
    expect(phaseAt(soft, 9.999).scale).toBeLessThan(0.56);
  });

  it("counts seconds down within a phase", () => {
    expect(phaseAt(soft, 0).secondsLeft).toBe(4);
    expect(phaseAt(soft, 1.2).secondsLeft).toBe(3);
    expect(phaseAt(soft, 3.9).secondsLeft).toBe(1);
    expect(phaseAt(soft, 4).secondsLeft).toBe(6);
  });

  it("holds steady during holds (box breathing)", () => {
    expect(phaseAt(box, 5).kind).toBe("hold-in");
    expect(phaseAt(box, 5).scale).toBe(1);
    expect(phaseAt(box, 13).kind).toBe("hold-out");
    expect(phaseAt(box, 13).scale).toBeCloseTo(0.55, 2);
  });

  it("loops: the same point in each cycle matches, and cycles are counted", () => {
    const a = phaseAt(soft, 2.5);
    const b = phaseAt(soft, 12.5);
    expect(b.kind).toBe(a.kind);
    expect(b.scale).toBeCloseTo(a.scale, 6);
    expect(b.cycle).toBe(1);
  });

  it("scale always stays within the orb's range", () => {
    for (const p of BREATH_PATTERNS) {
      for (let t = 0; t < 120; t += 0.37) {
        const s = phaseAt(p, t).scale;
        expect(s).toBeGreaterThanOrEqual(0.549);
        expect(s).toBeLessThanOrEqual(1.001);
      }
    }
  });
});
