"use client";

import { useState } from "react";
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
  tierFor,
  type CategoryKey,
  type Tier,
} from "@/lib/spinConnectContent";
import { SpinWheel } from "./SpinWheel";

const TOTAL_ROUNDS = 5;
const LETTER_COLORS: [string, string] = ["#FFE9F0", "#FFC7DD"];
const CATEGORY_COLORS: [string, string] = ["#E3F8ED", "#BFEBD3"];

type Stage = "spinning" | "landed" | "answering" | "checking" | "round-result" | "closing";

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
  // Placeholders until the player actually flicks each wheel — never shown,
  // since nothing reads these until both wheels have settled at least once.
  const [letter, setLetter] = useState(LETTERS[0]);
  const [category, setCategory] = useState<CategoryKey>(CATEGORIES[0].key);
  const [letterReady, setLetterReady] = useState(false);
  const [categoryReady, setCategoryReady] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastResults, setLastResults] = useState<boolean[]>([]);
  const [rounds, setRounds] = useState<RoundSummary[]>([]);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const tierInfo = tierFor(category, letter);

  // Once the player has flicked both wheels at least once this round, move
  // from "waiting for flicks" to showing what they landed on. After that,
  // either wheel can still be flicked again as many times as the player
  // wants — landing just updates that wheel's value and re-evaluates the
  // combo, with no cap on re-spins.
  function handleLetterSettle(idx: number) {
    setLetter(LETTERS[idx]);
    if (stage === "spinning") {
      setLetterReady(true);
      if (categoryReady) setStage("landed");
    }
  }

  function handleCategorySettle(idx: number) {
    setCategory(CATEGORIES[idx].key);
    if (stage === "spinning") {
      setCategoryReady(true);
      if (letterReady) setStage("landed");
    }
  }

  const wheelsDisabled =
    stage === "answering" || stage === "checking" || stage === "round-result" || stage === "closing";

  function resetWheelsForNewRound() {
    setLetterReady(false);
    setCategoryReady(false);
    setStage("spinning");
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

  async function submitRound() {
    setStage("checking");

    let results: boolean[];
    try {
      const res = await fetch("/api/games/spin-and-connect/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, letter, answers }),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.results)) throw new Error("bad response");
      results = data.results;
    } catch {
      // Couldn't reach our own validate endpoint at all — fall back to the
      // instant local word-bank check so the round never gets stuck.
      results = answers.map((a) => isValidAnswer(category, letter, a));
    }

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
    resetWheelsForNewRound();
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
    resetWheelsForNewRound();
  }

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
        <h1 className="font-heading text-2xl font-bold text-heading">Spin &amp; Connect</h1>
        <Pill tone="sky">
          Round {roundIndex + 1} of {TOTAL_ROUNDS}
        </Pill>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <Card className="flex flex-col items-center gap-3 py-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Letter</p>
          <SpinWheel
            labels={LETTERS}
            size={180}
            colors={LETTER_COLORS}
            disabled={wheelsDisabled}
            onSettle={handleLetterSettle}
          />
        </Card>
        <Card className="flex flex-col items-center gap-3 py-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Category</p>
          <SpinWheel
            labels={CATEGORIES.map((c) => c.emoji)}
            size={180}
            colors={CATEGORY_COLORS}
            disabled={wheelsDisabled}
            onSettle={handleCategorySettle}
          />
        </Card>
      </div>

      {stage === "spinning" && (!letterReady || !categoryReady) && (
        <p className="mt-4 text-center text-sm text-muted">
          <span aria-hidden>👆</span> Flick each wheel to spin it.
        </p>
      )}

      {stage === "landed" && (
        <Card className="mt-6 text-center">
          {tierInfo.tier === "none" ? (
            <>
              <p className="font-semibold text-heading">
                No valid answers for {letter} + {landedCatDef.label}. Flick either wheel for a new
                combo — spin as many times as you like.
              </p>
              <Button className="mt-4" variant="soft" onClick={nextRoundOrFinish} disabled={saving}>
                {roundIndex + 1 >= TOTAL_ROUNDS ? "See results" : "Skip to next round"}
              </Button>
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
                  : `Name one ${landedCatDef.singular} starting with "${letter}".`}
              </p>
              <Button className="mt-4" onClick={startRound}>
                Start round
              </Button>
              <p className="mt-3 text-xs text-muted">
                Not feeling this combo? Flick either wheel again for a new one.
              </p>
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
                className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Tip: type your answer as one word with no spaces (e.g. &quot;bajiraomastani&quot;).
          </p>
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={useHint}
              className="text-sm font-semibold text-muted hover:text-purple-text"
            >
              💡 Hint (no penalty)
            </button>
            <Button onClick={submitRound}>Submit round</Button>
          </div>
        </Card>
      )}

      {stage === "checking" && (
        <Card className="mt-6 flex flex-col items-center gap-3 py-10 text-center">
          <div className="h-10 w-10 animate-pulse rounded-full bg-blush" />
          <p className="text-sm text-muted">
            Checking your answers — anything our list doesn&apos;t recognize gets a quick look on
            Wikipedia…
          </p>
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
  if (tier === "medium") return 2;
  if (tier === "common") return 3;
  return 0;
}
