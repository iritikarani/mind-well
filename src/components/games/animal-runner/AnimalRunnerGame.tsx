"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnimalAvatar, type Pose } from "./AnimalAvatar";
import { ANIMALS, type AnimalKey } from "./animals";
import {
  LOSE_QUOTE,
  NEGATIVE_REMARKS,
  POSITIVE_REMARKS,
  winRemark,
} from "@/lib/animalRunnerContent";

const GAME_DURATION_MS = 120_000;
const TRAVEL_TIME_MS = 4600;
const PLAYER_X = 14; // percent from left
const SPAWN_MIN_GAP_MS = 5200;
const SPAWN_MAX_GAP_MS = 6600;
const JUMP_DURATION_MS = 520;
const DUCK_DURATION_MS = 750;
const START_HEARTS = 10;

type Sentiment = "positive" | "negative";
type ObstacleType = "jump" | "duck";

interface Obstacle {
  id: number;
  spawnedAt: number;
  type: ObstacleType;
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

export function AnimalRunnerGame() {
  const [stage, setStage] = useState<Stage>("select");
  const [animal, setAnimal] = useState<AnimalKey>("fox");
  const [hearts, setHearts] = useState(START_HEARTS);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [pose, setPose] = useState<Pose>("idle");
  const [obstacle, setObstacle] = useState<Obstacle | null>(null);
  const [obstacleX, setObstacleX] = useState(100);
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

  const poseRef = useRef<Pose>("idle");
  const heartsRef = useRef(START_HEARTS);
  const obstacleRef = useRef<Obstacle | null>(null);
  const nextSpawnAtRef = useRef(0);
  const startedAtRef = useRef(0);
  const usedRemarksRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const poseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endedRef = useRef(false);

  const statsRef = useRef({
    positiveAbsorbed: 0,
    negativeAbsorbed: 0,
    positiveDodged: 0,
    negativeDodged: 0,
  });

  const setPoseBoth = useCallback((p: Pose) => {
    poseRef.current = p;
    setPose(p);
  }, []);

  const doJump = useCallback(() => {
    if (stage !== "playing") return;
    if (poseRef.current === "jump" || poseRef.current === "duck") return;
    setPoseBoth("jump");
    if (poseTimeoutRef.current) clearTimeout(poseTimeoutRef.current);
    poseTimeoutRef.current = setTimeout(() => setPoseBoth("idle"), JUMP_DURATION_MS);
  }, [stage, setPoseBoth]);

  const doDuck = useCallback(() => {
    if (stage !== "playing") return;
    if (poseRef.current === "jump" || poseRef.current === "duck") return;
    setPoseBoth("duck");
    if (poseTimeoutRef.current) clearTimeout(poseTimeoutRef.current);
    poseTimeoutRef.current = setTimeout(() => setPoseBoth("idle"), DUCK_DURATION_MS);
  }, [stage, setPoseBoth]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        doJump();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        doDuck();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doJump, doDuck]);

  const finishGame = useCallback(
    (survived: boolean) => {
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
    },
    [],
  );

  const resolveObstacle = useCallback(
    (o: Obstacle) => {
      const cleared = poseRef.current === o.type;
      if (cleared) {
        if (o.sentiment === "positive") statsRef.current.positiveDodged += 1;
        else statsRef.current.negativeDodged += 1;
      } else {
        if (o.sentiment === "positive") {
          statsRef.current.positiveAbsorbed += 1;
          heartsRef.current = Math.min(10, heartsRef.current + 1);
          setFlash("good");
        } else {
          statsRef.current.negativeAbsorbed += 1;
          heartsRef.current = Math.max(0, heartsRef.current - 1);
          setFlash("bad");
        }
        setHearts(heartsRef.current);
        setTimeout(() => setFlash(null), 350);
      }
    },
    [],
  );

  useEffect(() => {
    if (stage !== "playing") return;

    startedAtRef.current = performance.now();
    nextSpawnAtRef.current = 900;
    endedRef.current = false;

    function tick(now: number) {
      const elapsed = now - startedAtRef.current;
      const remaining = Math.max(0, GAME_DURATION_MS - elapsed);
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        finishGame(true);
        return;
      }
      if (heartsRef.current <= 0) {
        finishGame(false);
        return;
      }

      // spawn
      if (!obstacleRef.current && elapsed >= nextSpawnAtRef.current) {
        const sentiment: Sentiment = Math.random() < 0.4 ? "positive" : "negative";
        const type: ObstacleType = Math.random() < 0.5 ? "jump" : "duck";
        const remark = pickRemark(sentiment, usedRemarksRef.current);
        const next: Obstacle = {
          id: Math.random(),
          spawnedAt: elapsed,
          type,
          sentiment,
          remark,
          resolved: false,
        };
        obstacleRef.current = next;
        setObstacle(next);
      }

      // move + resolve
      const o = obstacleRef.current;
      if (o) {
        const t = elapsed - o.spawnedAt;
        const x = 100 - 110 * (t / TRAVEL_TIME_MS);
        setObstacleX(x);

        const resolveT = TRAVEL_TIME_MS * ((100 - PLAYER_X) / 110);
        if (!o.resolved && t >= resolveT) {
          o.resolved = true;
          resolveObstacle(o);
        }

        if (t >= TRAVEL_TIME_MS) {
          obstacleRef.current = null;
          setObstacle(null);
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
  }, [stage, finishGame, resolveObstacle]);

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
    setObstacle(null);
    obstacleRef.current = null;
    setPoseBoth("idle");
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
          You&apos;ll run for two calm minutes. Jump or duck to reject a remark, or let it run through
          to take it in.
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
          Start running
        </Button>
      </div>
    );
  }

  if (stage === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <AnimalAvatar animal={animal} pose="idle" size={120} />
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
              Absorbed positive: {finalStats.positiveAbsorbed}
            </div>
            <div className="rounded-xl bg-blush px-3 py-2 text-blush-text">
              Absorbed negative: {finalStats.negativeAbsorbed}
            </div>
            <div className="rounded-xl bg-sky px-3 py-2 text-sky-text">
              Rejected positive: {finalStats.positiveDodged}
            </div>
            <div className="rounded-xl bg-butter px-3 py-2 text-butter-text">
              Rejected negative: {finalStats.negativeDodged}
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
        className={`relative h-72 overflow-hidden rounded-[24px] border border-black/5 bg-gradient-to-b from-sky/60 to-mint/40 transition ${
          flash === "bad" ? "ring-4 ring-blush-strong" : flash === "good" ? "ring-4 ring-mint" : ""
        }`}
      >
        {obstacle && (
          <div
            className="absolute top-1/2 max-w-[220px] -translate-y-1/2 rounded-2xl bg-surface/95 px-4 py-2 text-center text-sm font-semibold text-heading shadow-md"
            style={{ left: `${Math.min(Math.max(obstacleX, 2), 78)}%` }}
          >
            &quot;{obstacle.remark}&quot;
          </div>
        )}

        {obstacle && (
          <div
            className="absolute bottom-10"
            style={{
              left: `${obstacleX}%`,
              top: obstacle.type === "duck" ? "18%" : undefined,
              bottom: obstacle.type === "jump" ? "10%" : undefined,
            }}
          >
            <div
              className={`h-8 w-8 rounded-lg ${
                obstacle.sentiment === "negative" ? "bg-blush-strong" : "bg-mint-text/60"
              }`}
            />
          </div>
        )}

        <div className="absolute bottom-2 h-1 w-full bg-black/5" />
        <div className="absolute bottom-10" style={{ left: `${PLAYER_X}%` }}>
          <AnimalAvatar animal={animal} pose={pose} size={80} />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button variant="sky" onClick={doJump}>
          ↑ Jump
        </Button>
        <Button variant="mint" onClick={doDuck}>
          ↓ Duck
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Jump over a low remark or duck under a high one to reject it. Do nothing and it runs
        straight through you.
      </p>
    </div>
  );
}
