import { describe, expect, it, vi } from "vitest";

// badges.ts talks to the database for awarding; the catalog itself is pure.
vi.mock("@/lib/prisma", () => ({ prisma: {} }));

import { ALL_GAME_KEYS, BADGE_CATALOG } from "./badges";
import { GAMES } from "./games";

const entries = Object.entries(BADGE_CATALOG);

describe("badge catalog", () => {
  it("every badge has a name and a description", () => {
    for (const [key, b] of entries) {
      expect(b.label.length, key).toBeGreaterThan(2);
      expect(b.description.length, key).toBeGreaterThan(8);
    }
  });

  it("badge names are unique, so two badges never look the same", () => {
    const labels = entries.map(([, b]) => b.label.toLowerCase());
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("every game-specific badge belongs to a real game", () => {
    for (const [key, b] of entries) {
      if (b.game !== null) expect(ALL_GAME_KEYS, key).toContain(b.game);
    }
  });

  it("every game can earn at least one badge", () => {
    for (const g of GAMES) {
      expect(entries.some(([, b]) => b.game === g.key), g.label).toBe(true);
    }
  });

  it("no badge name is just a game's name", () => {
    const gameNames = GAMES.map((g) => g.label.toLowerCase());
    for (const [key, b] of entries) expect(gameNames, key).not.toContain(b.label.toLowerCase());
  });
});

describe("game names", () => {
  it("are unique and every game has a tagline", () => {
    const names = GAMES.map((g) => g.label.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
    for (const g of GAMES) expect(g.tagline.length, g.label).toBeGreaterThan(15);
  });
});
