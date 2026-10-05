"use client";

import { useEffect, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import {
  LEVEL1_PUZZLES,
  LEVEL2_PUZZLES,
  LEVEL3_PUZZLES,
  anagramsClosingRemark,
  checkAnagramAnswer,
  checkLevel3Answer,
  pickNextPuzzle,
  sameWord,
  type Level3Puzzle,
  type SimplePuzzle,
} from "@/lib/anagramsContent";

type Stage = "loading" | "level1" | "level2" | "level3" | "closing";

function now(): number {
  return Date.now();
}

export function AnagramsGame() {
  const [stage, setStage] = useState<Stage>("loading");
  const [puzzle1, setPuzzle1] = useState<SimplePuzzle | null>(null);
  const [puzzle2, setPuzzle2] = useState<SimplePuzzle | null>(null);
  const [puzzle3, setPuzzle3] = useState<Level3Puzzle | null>(null);

  const [answer1a, setAnswer1a] = useState("");
  const [answer1b, setAnswer1b] = useState("");
  const [answer1c, setAnswer1c] = useState("");
  const [error1, setError1] = useState<string | null>(null);

  const [answer2a, setAnswer2a] = useState("");
  const [answer2b, setAnswer2b] = useState("");
  const [error2, setError2] = useState<string | null>(null);

  const [answer3a, setAnswer3a] = useState("");
  const [answer3b, setAnswer3b] = useState("");
  const [error3, setError3] = useState<string | null>(null);

  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [finalUsedUncommon, setFinalUsedUncommon] = useState(false);

  const usedUncommonRef = useRef(false);
  const startedAtRef = useRef(0);

  async function newGame() {
    setStage("loading");
    setAnswer1a("");
    setAnswer1b("");
    setAnswer1c("");
    setError1(null);
    setAnswer2a("");
    setAnswer2b("");
    setError2(null);
    setAnswer3a("");
    setAnswer3b("");
    setError3(null);
    setNewBadges([]);
    setFinalUsedUncommon(false);
    usedUncommonRef.current = false;

    let next1 = pickNextPuzzle(LEVEL1_PUZZLES, []);
    let next2 = pickNextPuzzle(LEVEL2_PUZZLES, []);
    let next3 = pickNextPuzzle(LEVEL3_PUZZLES, []);

    try {
      const res = await fetch("/api/games/anagrams/next");
      const data = await res.json();
      if (res.ok) {
        next1 = LEVEL1_PUZZLES.find((p) => p.source === data.level1) ?? next1;
        next2 = LEVEL2_PUZZLES.find((p) => p.source === data.level2) ?? next2;
        next3 = LEVEL3_PUZZLES.find((p) => p.source === data.level3) ?? next3;
      }
    } catch {
      // Server pick failed — fall back to the local random puzzles above.
    }

    setPuzzle1(next1);
    setPuzzle2(next2);
    setPuzzle3(next3);
    startedAtRef.current = now();
    setStage("level1");
  }

  useEffect(() => {
    const id = setTimeout(newGame, 0);
    return () => clearTimeout(id);
  }, []);

  function submitLevel1() {
    if (!puzzle1) return;
    const answers = [answer1a, answer1b, answer1c];
    const results = answers.map((a) => checkAnagramAnswer(a, puzzle1));

    if (results.some((r) => !r.valid)) {
      setError1("All three need to be real, different words made from those same letters.");
      return;
    }
    const hasDuplicate = answers.some((a, i) => answers.some((b, j) => i < j && sameWord(a, b)));
    if (hasDuplicate) {
      setError1("Give three different words, not repeats of each other.");
      return;
    }

    if (results.some((r) => r.uncommon)) usedUncommonRef.current = true;
    setError1(null);
    setStage("level2");
  }

  function submitLevel2() {
    if (!puzzle2) return;
    const r1 = checkAnagramAnswer(answer2a, puzzle2);
    const r2 = checkAnagramAnswer(answer2b, puzzle2);

    if (!r1.valid || !r2.valid) {
      setError2("Both need to be real, different words made from those same letters.");
      return;
    }
    if (sameWord(answer2a, answer2b)) {
      setError2("Give two different words, not the same one twice.");
      return;
    }

    if (r1.uncommon || r2.uncommon) usedUncommonRef.current = true;
    setError2(null);
    setStage("level3");
  }

  async function submitLevel3() {
    if (!puzzle3) return;
    const r4 = checkLevel3Answer(answer3a, puzzle3, 4);
    const r5 = checkLevel3Answer(answer3b, puzzle3, 5);

    if (!r4.valid || !r5.valid) {
      setError3("Make sure you have a real 4-letter word and a real 5-letter word from those letters.");
      return;
    }

    if (r4.uncommon || r5.uncommon) usedUncommonRef.current = true;
    setError3(null);

    const elapsed = now() - startedAtRef.current;
    setTotalTimeMs(elapsed);
    setFinalUsedUncommon(usedUncommonRef.current);
    await finishSession(elapsed);
  }

  async function finishSession(elapsed: number) {
    if (!puzzle1 || !puzzle2 || !puzzle3) return;
    setSaving(true);
    try {
      const res = await fetch("/api/games/anagrams/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalTimeMs: elapsed,
          usedUncommonWord: usedUncommonRef.current,
          sources: { level1: puzzle1.source, level2: puzzle2.source, level3: puzzle3.source },
        }),
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

  if (stage === "loading" || !puzzle1 || !puzzle2 || !puzzle3) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="h-16 w-16 animate-pulse rounded-full bg-blush" />
        <p className="text-muted">Shuffling some letters…</p>
      </div>
    );
  }

  if (stage === "closing") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <Card className="p-8">
          <div className="text-5xl">🔀</div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-heading">All 3 levels complete</h1>
          <p className="mt-3 text-muted">
            {anagramsClosingRemark(totalTimeMs, finalUsedUncommon)}
          </p>
          <p className="mt-2 text-sm text-muted">
            Solved in {Math.round(totalTimeMs / 1000)} seconds
          </p>

          {newBadges.length > 0 && (
            <div className="mt-4 rounded-xl bg-butter px-4 py-2 text-sm font-semibold text-butter-text">
              New badge{newBadges.length > 1 ? "s" : ""}: {newBadges.join(", ")} 🎉
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="soft" onClick={newGame} disabled={saving}>
              Play again
            </Button>
            <LinkButton href="/dashboard">Back to dashboard</LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  const levelNumber = stage === "level1" ? 1 : stage === "level2" ? 2 : 3;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-heading">Anagrams</h1>
        <Pill tone="sky">Level {levelNumber} of 3</Pill>
      </div>

      <div className="mb-4 flex justify-center gap-4 text-sm font-semibold text-muted">
        <span className={levelNumber > 1 ? "text-mint-text" : "text-heading"}>
          Level 1 {levelNumber > 1 ? "✓" : "○"}
        </span>
        <span className={levelNumber > 2 ? "text-mint-text" : levelNumber === 2 ? "text-heading" : ""}>
          Level 2 {levelNumber > 2 ? "✓" : "○"}
        </span>
        <span className={levelNumber === 3 ? "text-heading" : ""}>Level 3 ○</span>
      </div>

      {stage === "level1" && (
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Level 1</p>
          <p className="mt-2 font-heading text-4xl font-bold tracking-widest text-heading">
            {puzzle1.source}
          </p>
          <p className="mt-3 text-muted">
            Rearrange those same letters into three different new 4-letter words.
          </p>
          <div className="mt-5 space-y-2">
            <input
              value={answer1a}
              onChange={(e) => setAnswer1a(e.target.value)}
              placeholder="First word"
              maxLength={12}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
            />
            <input
              value={answer1b}
              onChange={(e) => setAnswer1b(e.target.value)}
              placeholder="Second word"
              maxLength={12}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
            />
            <input
              value={answer1c}
              onChange={(e) => setAnswer1c(e.target.value)}
              placeholder="Third word"
              maxLength={12}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
            />
          </div>
          {error1 && <p className="mt-2 text-xs font-medium text-rose-500">{error1}</p>}
          <Button className="mt-5" onClick={submitLevel1}>
            Check
          </Button>
        </Card>
      )}

      {stage === "level2" && (
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Level 2</p>
          <p className="mt-2 font-heading text-4xl font-bold tracking-widest text-heading">
            {puzzle2.source}
          </p>
          <p className="mt-3 text-muted">
            Rearrange those letters into two different new 5-letter words.
          </p>
          <div className="mt-5 space-y-2">
            <input
              value={answer2a}
              onChange={(e) => setAnswer2a(e.target.value)}
              placeholder="First word"
              maxLength={12}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
            />
            <input
              value={answer2b}
              onChange={(e) => setAnswer2b(e.target.value)}
              placeholder="Second word"
              maxLength={12}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
            />
          </div>
          {error2 && <p className="mt-2 text-xs font-medium text-rose-500">{error2}</p>}
          <Button className="mt-5" onClick={submitLevel2}>
            Check
          </Button>
        </Card>
      )}

      {stage === "level3" && (
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Level 3</p>
          <p className="mt-2 font-heading text-4xl font-bold tracking-widest text-heading">
            {puzzle3.source}
          </p>
          <p className="mt-3 text-muted">
            Form a 4-letter word and a 5-letter word from those letters — you can reuse letters
            between the two.
          </p>
          <div className="mt-5 space-y-2">
            <input
              value={answer3a}
              onChange={(e) => setAnswer3a(e.target.value)}
              placeholder="4-letter word"
              maxLength={12}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
            />
            <input
              value={answer3b}
              onChange={(e) => setAnswer3b(e.target.value)}
              placeholder="5-letter word"
              maxLength={12}
              className="w-full rounded-2xl border border-black/5 bg-white/80 px-4 py-2.5 text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-purple/60"
            />
          </div>
          {error3 && <p className="mt-2 text-xs font-medium text-rose-500">{error3}</p>}
          <Button className="mt-5" onClick={submitLevel3} disabled={saving}>
            {saving ? "Finishing…" : "Finish"}
          </Button>
        </Card>
      )}
    </div>
  );
}
