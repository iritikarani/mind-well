"use client";

import { useEffect, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import {
  CATEGORIES,
  LETTERS,
  categoryByKey,
  closingRemark,
  getHint,
  isValidAnswer,
  randomCategory,
  randomLetter,
  tierFor,
  type CategoryKey,
  type Tier,
} from "@/lib/spinConnectContent";

const TOTAL_ROUNDS = 5;
const SPIN_DURATION_MS = 900;
const SPIN_TICK_MS = 70;

type Stage = "spinning" | "landed" | "answering" | "round-result" | "closing";

interface RoundSummary {
  letter: string;
  category: CategoryKey;
  tier: Tier;
  correctCount: number;
  hintsUsed: number;
}

const TIER_LABEL: Record<Tier, string> = {
  none: "No match",
  rare: "Rare",
  medium: "Medium",
  common: "Common",
};

export function SpinAndConnectGame() {
  const [stage, setStage] = useState<Stage>("spinning");
  const [roundIndex, setRoundIndex] = useState(0);
  // Stable placeholders for the initial server-rendered pass — the mount
  // effect below immediately randomizes and starts the spin animation on
  // the client, so these values are never actually shown.
  const [letter, setLetter] = useState(LETTERS[0]);
  const [category, setCategory] = useState<CategoryKey>(CATEGORIES[0].key);
  const [displayLetter, setDisplayLetter] = useState(letter);
  const [displayCategory, setDisplayCategory] = useState<CategoryKey>(category);
  const [spinning, setSpinning] = useState<{ letter: boolean; category: boolean }>({
    letter: true,
    category: true,
  });
  const [answers, setAnswers] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastResults, setLastResults] = useState<boolean[]>([]);
  const [rounds, setRounds] = useState<RoundSummary[]>([]);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const tierInfo = tierFor(category, letter);

  useEffect(() => {
    const id = setTimeout(() => spinWheels({ letter: true, category: true }), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function spinWheels(opts: { letter: boolean; category: boolean }) {
    setStage("spinning");
    setSpinning(opts);

    const nextLetter = opts.letter ? randomLetterExcept(letter) : letter;
    const nextCategory = opts.category ? randomCategoryExcept(category) : category;

    if (spinTimer.current) clearInterval(spinTimer.current);
    const start = Date.now();
    spinTimer.current = setInterval(() => {
      if (opts.letter) setDisplayLetter(randomLetter());
      if (opts.category) setDisplayCategory(randomCategory());

      if (Date.now() - start >= SPIN_DURATION_MS) {
        if (spinTimer.current) clearInterval(spinTimer.current);
        setLetter(nextLetter);
        setCategory(nextCategory);
        setDisplayLetter(nextLetter);
        setDisplayCategory(nextCategory);
        setStage("landed");
      }
    }, SPIN_TICK_MS);
  }

  function randomLetterExcept(exclude: string) {
    let next = randomLetter();
    while (next === exclude && LETTERS.length > 1) next = randomLetter();
    return next;
  }

  function randomCategoryExcept(exclude: CategoryKey) {
    let next = randomCategory();
    while (next === exclude && CATEGORIES.length > 1) next = randomCategory();
    return next;
  }

  function startRound() {
    setAnswers(Array.from({ length: tierInfo.required }, () => ""));
    setHintsUsed(0);
    setStage("answering");
  }

  function useHint() {
    const hint = getHint(category, letter, answers);
    if (!hint) return;
    const firstEmpty = answers.findIndex((a) => a.trim().length === 0);
    if (firstEmpty === -1) return;
    const next = [...answers];
    next[firstEmpty] = hint;
    setAnswers(next);
    setHintsUsed((h) => h + 1);
  }

  function submitRound() {
    const results = answers.map((a) => isValidAnswer(category, letter, a));
    const correctCount = results.filter(Boolean).length;
    setLastResults(results);

    const summary: RoundSummary = {
      letter,
      category,
      tier: tierInfo.tier as Tier,
      correctCount,
      hintsUsed,
    };
    setRounds((prev) => [...prev, summary]);
    setStage("round-result");
  }

  async function nextRoundOrFinish() {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      await finishSession();
      return;
    }
    setRoundIndex((i) => i + 1);
    spinWheels({ letter: true, category: true });
  }

  async function finishSession() {
    setSaving(true);
    try {
      const res = await fetch("/api/games/spin-and-connect/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rounds }),
      });
      const data = await res.json();
      if (res.ok && data.newBadges?.length) {
        setNewBadges(data.newBadges.map((b: { label: string }) => b.label));
      }
    } finally {
      setSaving(false);
      setStage("closing");
    }
  }

  function playAgain() {
    setRoundIndex(0);
    setRounds([]);
    setNewBadges([]);
    spinWheels({ letter: true, category: true });
  }

  const catDef = categoryByKey(displayCategory);
  const landedCatDef = categoryByKey(category);

  if (stage === "closing") {
    const totalCorrect = rounds.reduce((s, r) => s + r.correctCount, 0);
    const totalPossible = rounds.reduce((s, r) => s + requiredFor(r.tier), 0);

    return (
      <div className="mx-auto max-w-lg text-center">
        <Card className="p-8">
          <div className="text-5xl">🎡</div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-heading">Session complete</h1>
          <p className="mt-3 text-muted">{closingRemark(totalCorrect, totalPossible)}</p>
          <p className="mt-2 text-sm font-semibold text-heading">
            {totalCorrect}/{totalPossible} correct across {rounds.length} rounds
          </p>

          {newBadges.length > 0 && (
            <div className="mt-4 rounded-xl bg-butter px-4 py-2 text-sm font-semibold text-butter-text">
              New badge{newBadges.length > 1 ? "s" : ""}: {newBadges.join(", ")} 🎉
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="soft" onClick={playAgain} disabled={saving}>
              Play again
            </Button>
            <LinkButton href="/dashboard">Back to dashboard</LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-heading">Spin and Connect</h1>
        <Pill tone="sky">
          Round {roundIndex + 1} of {TOTAL_ROUNDS}
        </Pill>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`flex flex-col items-center justify-center gap-2 py-8 ${spinning.letter && stage === "spinning" ? "animate-pulse" : ""}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Letter</p>
          <p className="font-heading text-5xl font-bold text-heading">{displayLetter}</p>
        </Card>
        <Card
          className={`flex flex-col items-center justify-center gap-2 py-8 ${spinning.category && stage === "spinning" ? "animate-pulse" : ""}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Category</p>
          <p className="text-3xl">{catDef.emoji}</p>
          <p className="font-heading text-lg font-bold text-heading">{catDef.label}</p>
        </Card>
      </div>

      {stage === "landed" && (
        <Card className="mt-6 text-center">
          {tierInfo.tier === "none" ? (
            <>
              <p className="font-semibold text-heading">
                No valid answers for {letter} + {landedCatDef.label}. Pick a wheel to re-spin.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Button variant="sky" onClick={() => spinWheels({ letter: true, category: false })}>
                  Re-spin letter
                </Button>
                <Button variant="mint" onClick={() => spinWheels({ letter: false, category: true })}>
                  Re-spin category
                </Button>
              </div>
            </>
          ) : (
            <>
              <Pill tone={tierInfo.tier === "common" ? "mint" : tierInfo.tier === "medium" ? "butter" : "blush"}>
                {TIER_LABEL[tierInfo.tier]} combo · {tierInfo.required} answer
                {tierInfo.required > 1 ? "s" : ""}
              </Pill>
              <p className="mt-3 text-muted">
                {tierInfo.required > 1
                  ? `Name up to ${tierInfo.required} ${landedCatDef.label.toLowerCase()} starting with "${letter}".`
                  : `Name one ${landedCatDef.label.toLowerCase()} answer starting with "${letter}".`}
              </p>
              <Button className="mt-4" onClick={startRound}>
                Start round
              </Button>
            </>
          )}
        </Card>
      )}

      {stage === "answering" && (
        <Card className="mt-6">
          <p className="text-center font-semibold text-heading">
            {landedCatDef.label} starting with &quot;{letter}&quot;
          </p>
          <div className="mt-4 space-y-2">
            {answers.map((value, i) => (
              <input
                key={i}
                value={value}
                onChange={(e) => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
                placeholder={`Answer ${i + 1}`}
                className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blush-strong/60"
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={useHint}
              className="text-sm font-semibold text-muted hover:text-blush-text"
            >
              💡 Hint (no penalty)
            </button>
            <Button onClick={submitRound}>Submit round</Button>
          </div>
        </Card>
      )}

      {stage === "round-result" && (
        <Card className="mt-6 text-center">
          <p className="font-heading text-lg font-semibold text-heading">
            {lastResults.filter(Boolean).length}/{answers.length} correct
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {answers.map((a, i) => (
              <li key={i} className={lastResults[i] ? "text-mint-text" : "text-muted"}>
                {lastResults[i] ? "✓" : "—"} {a || "(blank)"}
              </li>
            ))}
          </ul>
          <Button className="mt-5" onClick={nextRoundOrFinish} disabled={saving}>
            {roundIndex + 1 >= TOTAL_ROUNDS ? (saving ? "Finishing…" : "See results") : "Next round"}
          </Button>
        </Card>
      )}
    </div>
  );
}

function requiredFor(tier: Tier): number {
  if (tier === "rare") return 1;
  if (tier === "medium") return 3;
  if (tier === "common") return 5;
  return 0;
}
