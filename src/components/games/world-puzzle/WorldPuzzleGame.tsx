"use client";

import { useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { monumentById, type MonumentDef } from "@/lib/worldPuzzleContent";
import { MonumentArt, ART_SIZE } from "./MonumentArt";

const GRID = 3;
const PIECE = ART_SIZE / GRID;
const CELLS = GRID * GRID;

type Stage = "loading" | "preview" | "puzzle" | "solved" | "revealed";

function shuffledSlots(): number[] {
  const slots = Array.from({ length: CELLS }, (_, i) => i);
  do {
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
  } while (slots.every((content, idx) => content === idx));
  return slots;
}

export function WorldPuzzleGame() {
  const [stage, setStage] = useState<Stage>("loading");
  const [monument, setMonument] = useState<MonumentDef | null>(null);
  const [slots, setSlots] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  async function applyFetchedMonument() {
    const res = await fetch("/api/games/world-puzzle/monument");
    const data = await res.json();
    const def = monumentById(data.monumentId);
    setMonument(def ?? null);
    setSlots(shuffledSlots());
    setStage("preview");
  }

  function loadMonument() {
    setStage("loading");
    setQuote(null);
    setNewBadges([]);
    setSelected(null);
    applyFetchedMonument();
  }

  useEffect(() => {
    let ignore = false;
    fetch("/api/games/world-puzzle/monument")
      .then((r) => r.json())
      .then((data) => {
        if (ignore) return;
        const def = monumentById(data.monumentId);
        setMonument(def ?? null);
        setSlots(shuffledSlots());
        setStage("preview");
      });
    return () => {
      ignore = true;
    };
  }, []);

  function handlePieceClick(slotIndex: number) {
    if (selected === null) {
      setSelected(slotIndex);
      return;
    }
    if (selected === slotIndex) {
      setSelected(null);
      return;
    }

    const next = [...slots];
    [next[selected], next[slotIndex]] = [next[slotIndex], next[selected]];
    setSlots(next);
    setSelected(null);

    if (next.every((content, idx) => content === idx)) {
      setStage("solved");
    }
  }

  async function flip() {
    if (!monument) return;
    setSaving(true);
    try {
      const res = await fetch("/api/games/world-puzzle/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monumentId: monument.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuote(data.quote);
        setLimitReached(!!data.limitReached);
        if (data.newBadges?.length) {
          setNewBadges(data.newBadges.map((b: { label: string }) => b.label));
        }
      }
    } finally {
      setSaving(false);
      setStage("revealed");
    }
  }

  if (stage === "loading" || !monument) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="h-16 w-16 animate-pulse rounded-full bg-blush" />
        <p className="text-muted">Finding a monument for you…</p>
      </div>
    );
  }

  if (stage === "preview") {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-heading text-3xl font-bold text-heading">World Puzzle</h1>
        <p className="mt-2 text-muted">
          No timer, no move count — just piece this together at your own pace.
        </p>
        <Card className="mt-6 flex flex-col items-center gap-4 p-6">
          <div className="overflow-hidden rounded-2xl">
            <MonumentArt def={monument} />
          </div>
          <p className="text-sm text-muted">Take a moment to look, then start whenever you&apos;re ready.</p>
          <Button onClick={() => setStage("puzzle")}>Start puzzle</Button>
        </Card>
      </div>
    );
  }

  const solved = stage === "solved";

  if (stage === "puzzle" || stage === "solved") {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="overflow-hidden rounded-lg border border-black/5">
            <MonumentArt def={monument} size={64} />
          </div>
          <p className="text-sm text-muted">Tap two pieces to swap them.</p>
        </div>

        <div
          className="mx-auto grid gap-1 rounded-2xl bg-white/60 p-2"
          style={{ gridTemplateColumns: `repeat(${GRID}, ${PIECE}px)`, width: "fit-content" }}
        >
          {slots.map((content, slotIndex) => (
            <button
              key={slotIndex}
              onClick={() => !solved && handlePieceClick(slotIndex)}
              disabled={solved}
              className={cn(
                "relative overflow-hidden rounded-md shadow-sm transition",
                selected === slotIndex && "ring-4 ring-blush-strong",
              )}
              style={{ width: PIECE, height: PIECE }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -Math.floor(content / GRID) * PIECE,
                  left: -(content % GRID) * PIECE,
                }}
              >
                <MonumentArt def={monument} />
              </div>
            </button>
          ))}
        </div>

        {solved && (
          <div className="mt-6">
            <p className="font-heading text-lg font-semibold text-heading">You put it all together 🌿</p>
            <Button className="mt-3" onClick={flip} disabled={saving}>
              {saving ? "Flipping…" : "Flip to reveal"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <Card className="p-8">
        <div className="overflow-hidden rounded-2xl">
          <MonumentArt def={monument} size={220} />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-heading">{monument.name}</h1>
        <p className="text-sm text-muted">{monument.country}</p>
        <p className="mt-4 text-muted">{quote}</p>

        {newBadges.length > 0 && (
          <div className="mt-4 rounded-xl bg-butter px-4 py-2 text-sm font-semibold text-butter-text">
            New badge{newBadges.length > 1 ? "s" : ""}: {newBadges.join(", ")} 🎉
          </div>
        )}

        {limitReached && (
          <p className="mt-4 text-sm text-muted">
            That&apos;s your World Puzzle for today — come back tomorrow for another one.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!limitReached && (
            <Button variant="soft" onClick={loadMonument}>
              Next monument
            </Button>
          )}
          <LinkButton href="/dashboard">Back to dashboard</LinkButton>
        </div>
      </Card>
    </div>
  );
}
