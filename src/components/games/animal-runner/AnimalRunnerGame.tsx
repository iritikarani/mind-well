"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimalAvatar } from "./AnimalAvatar";
import { ANIMALS, type AnimalKey } from "./animals";
import {
  LOSE_QUOTE,
  NEGATIVE_REMARKS,
  POSITIVE_REMARKS,
  winRemark,
} from "@/lib/animalRunnerContent";

const GAME_DURATION_MS = 120_000;
const FALL_DURATION_MS = 7200;
const CATCH_LINE_PCT = 82; // how far down the track the basket sits
const SPAWN_MIN_GAP_MS = 5400;
const SPAWN_MAX_GAP_MS = 7200;
const START_HEARTS = 10;
const BASKET_MIN_X = 8;
const BASKET_MAX_X = 88;
const CATCH_RADIUS = 10;
const KEY_MOVE_PCT_PER_SEC = 34;
const BUTTON_NUDGE_PCT = 12;

type Sentiment = "positive" | "negative";

interface FallingRemark {
  id: number;
  spawnedAt: number;
  x: number;
  sentiment: Sentiment;
  remark: string;
  resolved: boolean;
}

type Stage = "select" | "countdown" | "playing" | "result";

function pickRemark(sentiment: Sentiment, used: Set<string>) {
  const pool = sentiment === "positive" ? POSITIVE_REMARKS : NEGATIVE_REMARKS;
  const available = pool.filter((r) => !used.has(r));
  const source = available.length > 0 ? available : pool;
  const pick = source[Math.floor(Math.random() * source.length)];
  used.add(pick);
  return pick;
}

function clampBasketX(x: number) {
  return Math.min(BASKET_MAX_X, Math.max(BASKET_MIN_X, x));
}

export function AnimalRunnerGame() {
  const [stage, setStage] = useState<Stage>("select");
  const [animal, setAnimal] = useState<AnimalKey>("fox");
  const [hearts, setHearts] = useState(START_HEARTS);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [basketX, setBasketX] = useState(50);
  const [remark, setRemark] = useState<FallingRemark | null>(null);
  const [remarkY, setRemarkY] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [saving, setSaving] = useState(false);
  const [finalSurvived, setFinalSurvived] = useState(false);
  const [finalStats, setFinalStats] = useState({
    positiveAbsorbed: 0,
    negativeAbsorbed: 0,
    positiveDodged: 0,
    negativeDodged: 0,
  });

  const basketXRef = useRef(50);
  const heartsRef = useRef(START_HEARTS);
  const remarkRef = useRef<FallingRemark | null>(null);
  const nextSpawnAtRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastFrameAtRef = useRef(0);
  const usedRemarksRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endedRef = useRef(false);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const trackRef = useRef<HTMLDivElement | null>(null);

  const statsRef = useRef({
    positiveAbsorbed: 0,
    negativeAbsorbed: 0,
    positiveDodged: 0,
    negativeDodged: 0,
  });

  const setBasketXBoth = useCallback((x: number) => {
    const clamped = clampBasketX(x);
    basketXRef.current = clamped;
    setBasketX(clamped);
  }, []);

  const showFlash = useCallback((kind: "good" | "bad") => {
    setFlash(kind);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setFlash(null), 400);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (stage !== "playing") return;
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setBasketXBoth(pct);
    },
    [stage, setBasketXBoth],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        keysRef.current.left = true;
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        keysRef.current.right = true;
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "ArrowLeft") keysRef.current.left = false;
      else if (e.code === "ArrowRight") keysRef.current.right = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const nudgeBasket = useCallback(
    (delta: number) => {
      if (stage !== "playing") return;
      setBasketXBoth(basketXRef.current + delta);
    },
    [stage, setBasketXBoth],
  );

  const finishGame = useCallback((survived: boolean) => {
    if (endedRef.current) return;
    endedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const statsSnapshot = { ...statsRef.current };
    setFinalSurvived(survived);
    setFinalStats(statsSnapshot);
    setStage("result");
    setSaving(true);

    const payload = {
      survived,
      heartsRemaining: heartsRef.current,
      ...statsSnapshot,
    };

    fetch("/api/games/animal-runner/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .catch(() => {})
      .finally(() => setSaving(false));
  }, []);

  const resolveRemark = useCallback(
    (r: FallingRemark) => {
      const caught = Math.abs(r.x - basketXRef.current) <= CATCH_RADIUS;

      if (r.sentiment === "positive") {
        if (caught) {
          statsRef.current.positiveAbsorbed += 1;
          heartsRef.current = Math.min(10, heartsRef.current + 1);
          showFlash("good");
        } else {
          // missing a good one costs you, same as letting a bad one in
          statsRef.current.positiveDodged += 1;
          heartsRef.current = Math.max(0, heartsRef.current - 1);
          showFlash("bad");
        }
      } else {
        if (caught) {
          statsRef.current.negativeAbsorbed += 1;
          heartsRef.current = Math.max(0, heartsRef.current - 1);
          showFlash("bad");
        } else {
          // safely let a bad one pass — no penalty
          statsRef.current.negativeDodged += 1;
        }
      }
      setHearts(heartsRef.current);
    },
    [showFlash],
  );

  useEffect(() => {
    if (stage !== "playing") return;

    startedAtRef.current = performance.now();
    lastFrameAtRef.current = startedAtRef.current;
    nextSpawnAtRef.current = 1200;
    endedRef.current = false;

    function tick(now: number) {
      const elapsed = now - startedAtRef.current;
      const dtSec = Math.min(0.1, (now - lastFrameAtRef.current) / 1000);
      lastFrameAtRef.current = now;

      const remaining = Math.max(0, GAME_DURATION_MS - elapsed);
      setTimeLeftMs(remaining);

      // continuous keyboard movement
      if (keysRef.current.left || keysRef.current.right) {
        const delta = KEY_MOVE_PCT_PER_SEC * dtSec * (keysRef.current.right ? 1 : -1);
        setBasketXBoth(basketXRef.current + delta);
      }

      if (remaining <= 0) {
        finishGame(true);
        return;
      }
      if (heartsRef.current <= 0) {
        finishGame(false);
        return;
      }

      // spawn
      if (!remarkRef.current && elapsed >= nextSpawnAtRef.current) {
        const sentiment: Sentiment = Math.random() < 0.4 ? "positive" : "negative";
        const x = 15 + Math.random() * 70;
        const text = pickRemark(sentiment, usedRemarksRef.current);
        const next: FallingRemark = {
          id: Math.random(),
          spawnedAt: elapsed,
          x,
          sentiment,
          remark: text,
          resolved: false,
        };
        remarkRef.current = next;
        setRemark(next);
      }

      // fall + resolve
      const r = remarkRef.current;
      if (r) {
        const t = elapsed - r.spawnedAt;
        const y = 100 * (t / FALL_DURATION_MS);
        setRemarkY(y);

        const resolveT = FALL_DURATION_MS * (CATCH_LINE_PCT / 100);
        if (!r.resolved && t >= resolveT) {
          r.resolved = true;
          resolveRemark(r);
        }

        if (t >= FALL_DURATION_MS) {
          remarkRef.current = null;
          setRemark(null);
          nextSpawnAtRef.current =
            elapsed + SPAWN_MIN_GAP_MS + Math.random() * (SPAWN_MAX_GAP_MS - SPAWN_MIN_GAP_MS);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage, finishGame, resolveRemark, setBasketXBoth]);

  function startGame() {
    heartsRef.current = START_HEARTS;
    statsRef.current = {
      positiveAbsorbed: 0,
      negativeAbsorbed: 0,
      positiveDodged: 0,
      negativeDodged: 0,
    };
    usedRemarksRef.current = new Set();
    setHearts(START_HEARTS);
    setTimeLeftMs(GAME_DURATION_MS);
    setRemark(null);
    remarkRef.current = null;
    setBasketXBoth(50);
    setCountdown(3);
    setStage("countdown");
  }

  useEffect(() => {
    if (stage !== "countdown") return;
    const id = setTimeout(() => {
      if (countdown <= 0) {
        setStage("playing");
      } else {
        setCountdown((c) => c - 1);
      }
    }, 700);
    return () => clearTimeout(id);
  }, [stage, countdown]);

  if (stage === "select") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-bold text-heading">Pick your companion</h1>
        <p className="mt-2 text-muted">
          You&apos;ll have two calm minutes. Move your basket to catch the good remarks — and let
          the bad ones fall right past you.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {ANIMALS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAnimal(a.key)}
              className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition ${
                animal === a.key ? "bg-blush shadow-sm" : "bg-white/50 hover:bg-white/80"
              }`}
            >
              <AnimalAvatar animal={a.key} size={64} />
              <span className="text-xs font-semibold text-heading">{a.label}</span>
            </button>
          ))}
        </div>
        <Button onClick={startGame} className="mt-8 px-10 py-4 text-lg">
          Start catching
        </Button>
      </div>
    );
  }

  if (stage === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <AnimalAvatar animal={animal} size={120} />
        <p className="font-heading text-5xl font-bold text-heading">
          {countdown > 0 ? countdown : "Go!"}
        </p>
      </div>
    );
  }

  if (stage === "result") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <Card className="p-8">
          <div className="text-5xl">{finalSurvived ? "🌤️" : "🌧️"}</div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-heading">
            {finalSurvived ? "You made it through" : "Game over"}
          </h1>
          <p className="mt-3 text-muted">
            {finalSurvived
              ? winRemark(finalStats.positiveAbsorbed, finalStats.negativeAbsorbed)
              : LOSE_QUOTE}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-mint px-3 py-2 text-mint-text">
              Caught positive: {finalStats.positiveAbsorbed}
            </div>
            <div className="rounded-xl bg-blush px-3 py-2 text-blush-text">
              Caught negative: {finalStats.negativeAbsorbed}
            </div>
            <div className="rounded-xl bg-sky px-3 py-2 text-sky-text">
              Missed positive: {finalStats.positiveDodged}
            </div>
            <div className="rounded-xl bg-butter px-3 py-2 text-butter-text">
              Let negative pass: {finalStats.negativeDodged}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={startGame} variant="soft" disabled={saving}>
              Play again
            </Button>
            <LinkButton href="/dashboard">Back to dashboard</LinkButton>
          </div>
        </Card>
      </div>
    );
  }

  const secondsLeft = Math.ceil(timeLeftMs / 1000);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-0.5" aria-label={`${hearts} of 10 hearts`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={i < hearts ? "text-blush-strong" : "text-black/10"}>
              ●
            </span>
          ))}
        </div>
        <p className="font-heading text-lg font-bold text-heading">
          {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
        </p>
      </div>

      <div
        ref={trackRef}
        onPointerMove={handlePointerMove}
        style={{ touchAction: "none" }}
        className={`relative h-96 overflow-hidden rounded-[24px] border border-black/5 bg-gradient-to-b from-sky/60 to-mint/40 transition ${
          flash === "bad" ? "ring-4 ring-blush-strong" : flash === "good" ? "ring-4 ring-mint" : ""
        }`}
      >
        {remark && (
          <div
            className={`absolute max-w-[180px] -translate-x-1/2 rounded-2xl px-3 py-2 text-center text-xs font-semibold shadow-md ${
              remark.sentiment === "negative"
                ? "bg-blush-strong/90 text-blush-text"
                : "bg-mint/90 text-mint-text"
            }`}
            style={{ left: `${remark.x}%`, top: `${Math.min(remarkY, 100)}%` }}
          >
            &quot;{remark.remark}&quot;
          </div>
        )}

        <div
          className="absolute bottom-4 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${basketX}%` }}
        >
          <AnimalAvatar animal={animal} size={72} />
          <svg width="56" height="28" viewBox="0 0 56 28" className="-mt-2">
            <path d="M4 8 L52 8 L44 26 L12 26 Z" fill="#C98A4B" stroke="#8A5A2B" strokeWidth="2" />
            <path d="M4 8 L52 8" stroke="#8A5A2B" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M14 8 Q28 -6 42 8"
              fill="none"
              stroke="#8A5A2B"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button variant="sky" onClick={() => nudgeBasket(-BUTTON_NUDGE_PCT)}>
          ◀ Move
        </Button>
        <Button variant="mint" onClick={() => nudgeBasket(BUTTON_NUDGE_PCT)}>
          Move ▶
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Drag, use the arrow keys, or tap the buttons to move your basket. Catch a good remark to
        take it in — but miss one and it costs you just the same as catching a bad one.
      </p>
    </div>
  );
}
