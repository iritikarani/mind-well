"use client";

import { useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { monumentById, postcardNote, type MonumentDef } from "@/lib/worldPuzzleContent";
import { randomValidationMessage } from "@/lib/validationMessages";
import { MonumentArt } from "./MonumentArt";
import { SharePostcardButton } from "./SharePostcardButton";

const DEFAULT_GRID = 3;

type Stage = "loading" | "preview" | "puzzle" | "solved" | "revealed";

function shuffledSlots(cells: number): number[] {
  const slots = Array.from({ length: cells }, (_, i) => i);
  do {
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
  } while (slots.every((content, idx) => content === idx));
  return slots;
}

export function WorldPuzzleGame({ userName }: { userName: string }) {
  const [stage, setStage] = useState<Stage>("loading");
  const [monument, setMonument] = useState<MonumentDef | null>(null);
  const [gridSize, setGridSize] = useState(DEFAULT_GRID);
  const [slots, setSlots] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hintedSlot, setHintedSlot] = useState<number | null>(null);
  const [quote, setQuote] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [postcardFlipped, setPostcardFlipped] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  async function applyFetchedMonument() {
    const res = await fetch("/api/games/world-puzzle/monument");
    const data = await res.json();
    const def = monumentById(data.monumentId);
    const size = data.gridSize ?? DEFAULT_GRID;
    setMonument(def ?? null);
    setGridSize(size);
    setSlots(shuffledSlots(size * size));
    setStage("preview");
  }

  function loadMonument() {
    setStage("loading");
    setQuote(null);
    setNote(null);
    setNewBadges([]);
    setSelected(null);
    setPostcardFlipped(false);
    applyFetchedMonument();
  }

  useEffect(() => {
    let ignore = false;
    fetch("/api/games/world-puzzle/monument")
      .then((r) => r.json())
      .then((data) => {
        if (ignore) return;
        const def = monumentById(data.monumentId);
        const size = data.gridSize ?? DEFAULT_GRID;
        setMonument(def ?? null);
        setGridSize(size);
        setSlots(shuffledSlots(size * size));
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

  function handleHint() {
    const targetIdx = slots.findIndex((content, idx) => content !== idx);
    if (targetIdx === -1) return;
    const sourceIdx = slots.indexOf(targetIdx);

    const next = [...slots];
    [next[targetIdx], next[sourceIdx]] = [next[sourceIdx], next[targetIdx]];
    setSlots(next);
    setSelected(null);
    setHintedSlot(targetIdx);
    setTimeout(() => setHintedSlot(null), 900);

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
        setNote(postcardNote(monument));
        setLimitReached(!!data.limitReached);
        if (data.newBadges?.length) {
          setNewBadges(data.newBadges.map((b: { label: string }) => b.label));
        }
      }
    } finally {
      setSaving(false);
      setValidationMessage(randomValidationMessage());
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
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold text-heading">World Puzzle</h1>
          <LinkButton href="/games/world-puzzle/my-world" variant="ghost" className="px-3 py-1.5 text-sm">
            My World 🗺️
          </LinkButton>
        </div>
        <p className="mt-2 text-muted">
          No timer, no move count — just piece this together at your own pace.
        </p>
        <Card className="mt-6 flex flex-col items-center gap-4 p-6">
          <div className="aspect-square w-full max-w-[300px] overflow-hidden rounded-2xl">
            <MonumentArt def={monument} size="100%" />
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
        <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
          <div className="overflow-hidden rounded-lg border border-black/5">
            <MonumentArt def={monument} size={64} />
          </div>
          <p className="text-sm text-muted">Tap two pieces to swap them.</p>
          {!solved && (
            <Button variant="sky" className="px-4 py-1.5 text-xs" onClick={handleHint}>
              Hint
            </Button>
          )}
        </div>

        <div
          className="mx-auto grid w-full max-w-[300px] gap-1 rounded-2xl bg-white/60 p-2"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {slots.map((content, slotIndex) => (
            <button
              key={slotIndex}
              onClick={() => !solved && handlePieceClick(slotIndex)}
              disabled={solved}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md shadow-sm transition",
                selected === slotIndex && "ring-4 ring-blush-strong",
                hintedSlot === slotIndex && "ring-4 ring-sky",
              )}
            >
              <div
                style={{
                  position: "absolute",
                  top: `${-Math.floor(content / gridSize) * 100}%`,
                  left: `${-(content % gridSize) * 100}%`,
                  width: `${gridSize * 100}%`,
                  height: `${gridSize * 100}%`,
                }}
              >
                <MonumentArt def={monument} size="100%" />
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
        <div className="postcard-scene mx-auto h-[300px] w-full max-w-[280px] sm:h-[340px] sm:max-w-[320px]">
          <div
            className={cn(
              "postcard-flipper relative h-full w-full",
              postcardFlipped && "is-flipped",
            )}
          >
            <div className="postcard-face absolute inset-0 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={monument.image}
                alt={monument.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="postcard-face postcard-face-back flex flex-col items-center justify-center rounded-2xl bg-lavender p-5 text-center">
              <h2 className="font-heading text-xl font-bold text-heading">{monument.name}</h2>
              <p className="text-sm text-muted">{monument.country}</p>
              <p className="mt-3 text-sm text-heading">{note}</p>
              <p className="mt-3 text-xs italic text-purple-text">{quote}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => setPostcardFlipped((v) => !v)}>
            {postcardFlipped ? "Flip back" : "Flip postcard"}
          </Button>
          {quote && note && (
            <SharePostcardButton
              imageUrl={monument.image}
              name={monument.name}
              country={monument.country}
              note={note}
              quote={quote}
              userName={userName}
            />
          )}
        </div>

        <p className="mt-5 font-heading text-sm font-semibold text-purple-text">
          {validationMessage} <span aria-hidden>♡</span>
        </p>

        {newBadges.length > 0 && (
          <div className="mt-4 rounded-xl bg-butter px-4 py-2 text-sm font-semibold text-butter-text">
            New badge{newBadges.length > 1 ? "s" : ""}: {newBadges.join(", ")} 🎉
          </div>
        )}

        {limitReached && (
          <p className="mt-4 text-sm text-muted">
            You&apos;ve played the game today. Come back tomorrow.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!limitReached && (
            <Button variant="soft" onClick={loadMonument}>
              Next monument
            </Button>
          )}
          <LinkButton href="/games/world-puzzle/my-world" variant="lavender">
            My World 🗺️
          </LinkButton>
          <LinkButton href="/dashboard">Back to dashboard</LinkButton>
        </div>
      </Card>
    </div>
  );
}
