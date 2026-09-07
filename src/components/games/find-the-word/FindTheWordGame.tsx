"use client";

import { useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { pickGridWords, wordByName, type QuestionVariant, type WordDef } from "@/lib/findTheWordContent";
import { generateGrid, lineBetween, type Cell, type WordSearchGrid } from "@/lib/wordSearchGrid";

const GRID_SIZE = 8;
const GRID_WORD_COUNT = 8;
const TARGET_FOUND = 3;

type Stage = "loading" | "searching" | "loading-question" | "question" | "remark" | "closing";

interface SessionEntry {
  word: string;
  variantIndex: number;
  outcome: "yes" | "no" | "answered" | "skipped";
}

function cellKey(row: number, col: number) {
  return `${row},${col}`;
}

export function FindTheWordGame() {
  const [stage, setStage] = useState<Stage>("loading");
  const [grid, setGrid] = useState<WordSearchGrid | null>(null);
  const [gridWords, setGridWords] = useState<WordDef[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [selStart, setSelStart] = useState<Cell | null>(null);
  const [entries, setEntries] = useState<SessionEntry[]>([]);

  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number | null>(null);
  const [currentVariant, setCurrentVariant] = useState<QuestionVariant | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [remarkText, setRemarkText] = useState("");

  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  function newGame() {
    setStage("loading");
    setFoundWords(new Set());
    setFoundCells(new Set());
    setSelStart(null);
    setEntries([]);
    setNewBadges([]);

    // An 8x8 grid gives long words very few valid lines, so a single
    // attempt can occasionally seat only 7 of 8 by bad luck — retry with
    // a fresh word pick/layout until all of them fit.
    let generated = generateGrid(GRID_SIZE, []);
    let placedWords: WordDef[] = [];
    for (let attempt = 0; attempt < 20; attempt++) {
      const words = pickGridWords(GRID_WORD_COUNT, GRID_SIZE);
      const candidate = generateGrid(GRID_SIZE, words.map((w) => w.word));
      if (candidate.placements.length >= GRID_WORD_COUNT) {
        generated = candidate;
        placedWords = candidate.placements
          .map((p) => wordByName(p.word))
          .filter((w): w is WordDef => !!w);
        break;
      }
      if (candidate.placements.length > placedWords.length) {
        generated = candidate;
        placedWords = candidate.placements
          .map((p) => wordByName(p.word))
          .filter((w): w is WordDef => !!w);
      }
    }
    setGrid(generated);
    setGridWords(placedWords);
    setStage("searching");
  }

  useEffect(() => {
    const id = setTimeout(newGame, 0);
    return () => clearTimeout(id);
  }, []);

  async function handleCellClick(row: number, col: number) {
    if (!grid || stage !== "searching") return;

    if (!selStart) {
      setSelStart({ row, col });
      return;
    }
    if (selStart.row === row && selStart.col === col) {
      setSelStart(null);
      return;
    }

    const path = lineBetween(selStart, { row, col });
    setSelStart(null);
    if (!path) return;

    const forward = path.map((c) => grid.letters[c.row][c.col]).join("");
    const backward = [...forward].reverse().join("");
    const match = grid.placements.find(
      (p) => !foundWords.has(p.word) && (p.word === forward || p.word === backward),
    );
    if (!match) return;

    const nextFoundWords = new Set(foundWords);
    nextFoundWords.add(match.word);
    setFoundWords(nextFoundWords);

    const nextFoundCells = new Set(foundCells);
    match.cells.forEach((c) => nextFoundCells.add(cellKey(c.row, c.col)));
    setFoundCells(nextFoundCells);

    setStage("loading-question");
    const res = await fetch("/api/games/find-the-word/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: match.word }),
    });
    const data = await res.json();
    setCurrentWord(match.word);
    setCurrentVariantIndex(data.variantIndex);
    setCurrentVariant(data.variant);
    setAnswerDraft("");
    setStage("question");
  }

  function answerYesNo(outcome: "yes" | "no") {
    if (!currentVariant || currentVariant.type !== "yesno" || !currentWord || currentVariantIndex === null) {
      return;
    }
    setRemarkText(outcome === "yes" ? currentVariant.yes : currentVariant.no);
    setEntries((prev) => [...prev, { word: currentWord, variantIndex: currentVariantIndex, outcome }]);
    setStage("remark");
  }

  function answerOpen(skip: boolean) {
    if (!currentVariant || currentVariant.type !== "open" || !currentWord || currentVariantIndex === null) {
      return;
    }
    const trimmed = answerDraft.trim();
    if (skip || trimmed.length === 0) {
      setRemarkText(currentVariant.skipped);
      setEntries((prev) => [...prev, { word: currentWord, variantIndex: currentVariantIndex, outcome: "skipped" }]);
    } else {
      setRemarkText(`"${trimmed}" — ${currentVariant.answered}`);
      setEntries((prev) => [...prev, { word: currentWord, variantIndex: currentVariantIndex, outcome: "answered" }]);
    }
    setStage("remark");
  }

  async function continueAfterRemark() {
    if (entries.length >= TARGET_FOUND) {
      await finishSession();
    } else {
      setStage("searching");
    }
  }

  async function finishSession() {
    setSaving(true);
    try {
      const res = await fetch("/api/games/find-the-word/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordsFound: entries }),
      });
      const data = await res.json();
      if (res.ok) {
        setLimitReached(!!data.limitReached);
        if (data.newBadges?.length) {
          setNewBadges(data.newBadges.map((b: { label: string }) => b.label));
        }
      }
    } finally {
      setSaving(false);
      setStage("closing");
    }
  }

  if (stage === "loading" || !grid) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="h-16 w-16 animate-pulse rounded-full bg-blush" />
        <p className="text-muted">Setting up your word search…</p>
      </div>
    );
  }

  if (stage === "closing") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <Card className="p-8">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-heading">
            You found 3 words! You got 3 remarks!
          </h1>
          <p className="mt-3 text-muted">
            {entries.map((e) => e.word).join(", ")}
          </p>

          {newBadges.length > 0 && (
            <div className="mt-4 rounded-xl bg-butter px-4 py-2 text-sm font-semibold text-butter-text">
              New badge{newBadges.length > 1 ? "s" : ""}: {newBadges.join(", ")} 🎉
            </div>
          )}

          {limitReached && (
            <p className="mt-4 text-sm text-muted">
              That&apos;s your Find the Word for today — come back tomorrow for more.
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {!limitReached && (
              <Button variant="soft" onClick={newGame} disabled={saving}>
                Play again
              </Button>
            )}
            <LinkButton href="/dashboard">Back to dashboard</LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  const wordDef = currentWord ? wordByName(currentWord) : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-heading">Find the Word</h1>
        <Pill tone="sky">{entries.length}/3 found</Pill>
      </div>

      {(stage === "searching" || stage === "loading-question") && (
        <>
          <p className="mb-4 text-center text-sm text-muted">
            Select two ends of a word — any direction. Find any 3 to finish.
          </p>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center">
            <div
              className="grid select-none gap-[2px] rounded-2xl bg-white/60 p-2"
              style={{ gridTemplateColumns: `repeat(${grid.size}, minmax(0, 1fr))`, width: 320 }}
            >
              {grid.letters.map((rowLetters, row) =>
                rowLetters.map((letter, col) => {
                  const key = cellKey(row, col);
                  const isFound = foundCells.has(key);
                  const isSelected = selStart?.row === row && selStart?.col === col;
                  return (
                    <button
                      key={key}
                      onClick={() => handleCellClick(row, col)}
                      disabled={stage !== "searching"}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-md text-xs font-semibold text-heading transition sm:text-sm",
                        isFound ? "bg-mint text-mint-text" : "bg-surface hover:bg-blush/40",
                        isSelected && "ring-2 ring-blush-strong",
                      )}
                    >
                      {letter}
                    </button>
                  );
                }),
              )}
            </div>

            <div className="w-full max-w-[220px] rounded-2xl bg-white/60 p-4 sm:w-44">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Words to find
              </p>
              <ul className="space-y-1.5">
                {gridWords.map((w) => {
                  const isFound = foundWords.has(w.word);
                  return (
                    <li
                      key={w.word}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-2 py-1 text-sm font-semibold",
                        isFound ? "bg-mint/60 text-mint-text line-through" : "text-heading",
                      )}
                    >
                      <span>{w.word}</span>
                      <span
                        className={cn(
                          "ml-2 h-2 w-2 shrink-0 rounded-full",
                          w.sentiment === "positive" ? "bg-mint-text/70" : "bg-blush-strong/70",
                        )}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </>
      )}

      {(stage === "question" || stage === "remark") && wordDef && currentVariant && (
        <Card className="mt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            You found &quot;{wordDef.word}&quot;
          </p>

          {stage === "question" && (
            <>
              <p className="mt-3 font-heading text-lg font-semibold text-heading">
                {currentVariant.prompt}
              </p>
              {currentVariant.type === "yesno" ? (
                <div className="mt-5 flex justify-center gap-3">
                  <Button variant="sky" onClick={() => answerYesNo("yes")}>
                    Yes
                  </Button>
                  <Button variant="mint" onClick={() => answerYesNo("no")}>
                    No
                  </Button>
                </div>
              ) : (
                <div className="mt-5">
                  <input
                    autoFocus
                    value={answerDraft}
                    onChange={(e) => setAnswerDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") answerOpen(false);
                    }}
                    placeholder="Type as much or as little as you like…"
                    maxLength={200}
                    className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blush-strong/60"
                  />
                  <div className="mt-4 flex justify-center gap-3">
                    <Button variant="ghost" onClick={() => answerOpen(true)}>
                      Skip
                    </Button>
                    <Button onClick={() => answerOpen(false)}>Share</Button>
                  </div>
                </div>
              )}
            </>
          )}

          {stage === "remark" && (
            <>
              <p className="mt-3 text-muted">{remarkText}</p>
              <Button className="mt-6" onClick={continueAfterRemark} disabled={saving}>
                {entries.length >= TARGET_FOUND
                  ? saving
                    ? "Finishing…"
                    : "See results"
                  : "Keep searching"}
              </Button>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
