"use client";

import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { COLORS, colorByKey, type ColorKey } from "@/lib/colorTheoryContent";

type Stage = "select" | "loading" | "questions" | "closing";

export function ColorTheoryGame() {
  const [stage, setStage] = useState<Stage>("select");
  const [color, setColor] = useState<ColorKey | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [limitReached, setLimitReached] = useState(false);

  async function chooseColor(key: ColorKey) {
    setColor(key);
    setStage("loading");
    setAnswers([]);
    setCurrent(0);
    setDraft("");
    setNewBadges([]);

    const res = await fetch("/api/games/color-theory/questions");
    const data = await res.json();
    setQuestions(data.questions ?? []);
    setStage("questions");
  }

  function next() {
    const updated = [...answers];
    updated[current] = draft;
    setAnswers(updated);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setDraft(updated[current + 1] ?? "");
    } else {
      finish(updated);
    }
  }

  async function finish(finalAnswers: string[]) {
    if (!color) return;
    setSaving(true);
    try {
      const res = await fetch("/api/games/color-theory/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color, questions, answers: finalAnswers }),
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

  function playAgain() {
    setColor(null);
    setStage("select");
  }

  if (stage === "select") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-bold text-heading">Pick your favorite color</h1>
        <p className="mt-2 text-muted">
          You&apos;ll answer 7 short reflective questions, then leave with an affirmation.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-5">
          {COLORS.map((c) => (
            <button
              key={c.key}
              onClick={() => chooseColor(c.key)}
              className="flex flex-col items-center gap-2 rounded-2xl p-3 transition hover:-translate-y-0.5"
            >
              <span
                className="h-16 w-16 rounded-full shadow-sm"
                style={{
                  backgroundColor: c.hex,
                  border: c.border ? "1px solid rgba(0,0,0,0.08)" : undefined,
                }}
              />
              <span className="text-xs font-semibold text-heading">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div
          className="h-16 w-16 animate-pulse rounded-full"
          style={{ backgroundColor: color ? colorByKey(color).hex : undefined }}
        />
        <p className="text-muted">Finding your questions…</p>
      </div>
    );
  }

  if (stage === "questions" && color) {
    const def = colorByKey(color);
    return (
      <div className="mx-auto max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: def.hex, color: def.textHex }}
          >
            {def.label}
          </span>
          <p className="text-sm font-semibold text-muted">
            Question {current + 1} of {questions.length}
          </p>
        </div>

        <Card>
          <p className="font-heading text-xl font-semibold text-heading">{questions[current]}</p>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") next();
            }}
            placeholder="A few words is plenty…"
            maxLength={120}
            className="mt-5 w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blush-strong/60"
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={next}>
              Skip
            </Button>
            <Button onClick={next} disabled={saving}>
              {current + 1 < questions.length ? "Next" : "Finish"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (stage === "closing" && color) {
    const def = colorByKey(color);
    return (
      <div className="mx-auto max-w-lg text-center">
        <Card className="p-8">
          <span
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl shadow-sm"
            style={{
              backgroundColor: def.hex,
              border: def.border ? "1px solid rgba(0,0,0,0.08)" : undefined,
            }}
          >
            🎨
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-heading">{def.affirmation}</h1>
          <p className="mt-2 text-muted">Thanks for taking a moment to reflect.</p>

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
              <Button variant="soft" onClick={playAgain}>
                Play again
              </Button>
            )}
            <LinkButton href="/dashboard">Back to dashboard</LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
