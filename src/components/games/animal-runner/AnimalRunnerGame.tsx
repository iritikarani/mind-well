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
const START_HEARTS = 10;
const PLAYER_X = 18; // fixed horizontal position of the runner, percent from left
const OBSTACLE_SPAWN_X = 112; // starts off-screen right
const OBSTACLE_TRAVEL_MS = 2200; // time for an obstacle to reach the player
const OBSTACLE_TAIL_MS = 350; // extra travel after a collision, so it visibly passes through
const SPAWN_MIN_GAP_MS = 650;
const SPAWN_MAX_GAP_MS = 1300;
const JUMP_MS = 520;
const DUCK_TAP_MS = 550;
const SWIPE_DOWN_THRESHOLD = 30;
const TAP_MAX_MS = 400;
const TAP_MAX_DRIFT = 20;

type Sentiment = "positive" | "negative";
type ObstacleKind = "low" | "high";
type Pose = "idle" | "jump" | "duck";

const BUBBLE_COLORS = [
  "bg-blush/90 text-blush-text",
  "bg-butter/90 text-butter-text",
  "bg-sky/90 text-sky-text",
  "bg-mint/90 text-mint-text",
  "bg-peach/90 text-blush-text",
] as const;

interface Obstacle {
  id: number;
  spawnedAt: number;
  kind: ObstacleKind;
  sentiment: Sentiment;
  remark: string;
  resolved: boolean;
  avoided: boolean;
  colorClass: string;
}

type Stage = "select" | "countdown" | "playing" | "result";

const ENVIRONMENTS = [
  { name: "meadow", sky: "from-sky/60 to-mint/40", ground: "bg-mint-text/40" },
  { name: "forest", sky: "from-mint/60 to-lavender/40", ground: "bg-mint-text/40" },
  { name: "beach", sky: "from-sky/70 to-butter/40", ground: "bg-butter-text/30" },
  { name: "night sky", sky: "from-lavender/70 to-blush/30", ground: "bg-lavender-text/30" },
  { name: "garden", sky: "from-blush/50 to-mint/40", ground: "bg-blush-text/30" },
] as const;

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
  const [environment, setEnvironment] = useState<(typeof ENVIRONMENTS)[number]>(ENVIRONMENTS[0]);
  const [hearts, setHearts] = useState(START_HEARTS);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [pose, setPose] = useState<Pose>("idle");
  const [obstacle, setObstacle] = useState<Obstacle | null>(null);
  const [obstacleX, setObstacleX] = useState(OBSTACLE_SPAWN_X);
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

  const stageRef = useRef<Stage>("select");
  const heartsRef = useRef(START_HEARTS);
  const poseRef = useRef<Pose>("idle");
  const obstacleRef = useRef<Obstacle | null>(null);
  const nextSpawnAtRef = useRef(0);
  const startedAtRef = useRef(0);
  const usedRemarksRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duckHeldRef = useRef(false);
  const endedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const statsRef = useRef({
    positiveAbsorbed: 0,
    negativeAbsorbed: 0,
    positiveDodged: 0,
    negativeDodged: 0,
  });

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const setPoseBoth = useCallback((p: Pose) => {
    poseRef.current = p;
    setPose(p);
  }, []);

  const showFlash = useCallback((kind: "good" | "bad") => {
    setFlash(kind);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setFlash(null), 400);
  }, []);

  const doJump = useCallback(() => {
    if (stageRef.current !== "playing" || poseRef.current !== "idle") return;
    setPoseBoth("jump");
    if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
    jumpTimeoutRef.current = setTimeout(() => {
      if (poseRef.current === "jump") setPoseBoth("idle");
    }, JUMP_MS);
  }, [setPoseBoth]);

  const doDuckTap = useCallback(() => {
    if (stageRef.current !== "playing" || poseRef.current !== "idle") return;
    setPoseBoth("duck");
    if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
    duckTimeoutRef.current = setTimeout(() => {
      if (poseRef.current === "duck" && !duckHeldRef.current) setPoseBoth("idle");
    }, DUCK_TAP_MS);
  }, [setPoseBoth]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (stageRef.current !== "playing") return;
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        doJump();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        if (!duckHeldRef.current) {
          duckHeldRef.current = true;
          if (poseRef.current === "idle") setPoseBoth("duck");
        }
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "ArrowDown") {
        duckHeldRef.current = false;
        if (stageRef.current === "playing" && poseRef.current === "duck") setPoseBoth("idle");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [doJump, setPoseBoth]);

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (stageRef.current !== "playing") return;
    touchStartRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  }, []);

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (stageRef.current !== "playing" || !touchStartRef.current) return;
      const dx = e.clientX - touchStartRef.current.x;
      const dy = e.clientY - touchStartRef.current.y;
      const dt = performance.now() - touchStartRef.current.t;
      touchStartRef.current = null;

      if (dy > SWIPE_DOWN_THRESHOLD && dy > Math.abs(dx)) {
        doDuckTap();
      } else if (dt < TAP_MAX_MS && Math.abs(dx) < TAP_MAX_DRIFT && Math.abs(dy) < TAP_MAX_DRIFT) {
        doJump();
      }
    },
    [doJump, doDuckTap],
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

  const resolveObstacle = useCallback(
    (o: Obstacle) => {
      const avoided =
        (o.kind === "low" && poseRef.current === "jump") ||
        (o.kind === "high" && poseRef.current === "duck");
      o.avoided = avoided;

      if (avoided) {
        if (o.sentiment === "positive") statsRef.current.positiveDodged += 1;
        else statsRef.current.negativeDodged += 1;
        return;
      }

      if (o.sentiment === "positive") {
        statsRef.current.positiveAbsorbed += 1;
        heartsRef.current = Math.min(10, heartsRef.current + 1);
        showFlash("good");
      } else {
        statsRef.current.negativeAbsorbed += 1;
        heartsRef.current = Math.max(0, heartsRef.current - 1);
        showFlash("bad");
      }
      setHearts(heartsRef.current);
    },
    [showFlash],
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

      if (!obstacleRef.current && elapsed >= nextSpawnAtRef.current) {
        const sentiment: Sentiment = Math.random() < 0.4 ? "positive" : "negative";
        const kind: ObstacleKind = Math.random() < 0.5 ? "low" : "high";
        const text = pickRemark(sentiment, usedRemarksRef.current);
        const next: Obstacle = {
          id: Math.random(),
          spawnedAt: elapsed,
          kind,
          sentiment,
          remark: text,
          resolved: false,
          avoided: false,
          colorClass: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        };
        obstacleRef.current = next;
        setObstacle(next);
      }

      const o = obstacleRef.current;
      if (o) {
        const t = elapsed - o.spawnedAt;
        const progress = Math.min(1, t / OBSTACLE_TRAVEL_MS);
        const x = OBSTACLE_SPAWN_X - (OBSTACLE_SPAWN_X - PLAYER_X) * progress;
        setObstacleX(x);

        if (!o.resolved && t >= OBSTACLE_TRAVEL_MS) {
          o.resolved = true;
          resolveObstacle(o);
        }

        const shouldClear = o.resolved && o.avoided ? true : t >= OBSTACLE_TRAVEL_MS + OBSTACLE_TAIL_MS;
        if (shouldClear) {
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
    setEnvironment(ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)]);
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
    setObstacleX(OBSTACLE_SPAWN_X);
    duckHeldRef.current = false;
    if (jumpTimeoutRef.current) clearTimeout(jumpTimeoutRef.current);
    if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
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
          You&apos;ll have two calm minutes. Jump over the thoughts on the ground and duck under the
          floating ones — kind ones give you a little lift either way.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {ANIMALS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAnimal(a.key)}
              className={`flex flex-col items-center gap-2 rounded-2xl p-3 transition ${
                animal === a.key ? "bg-lavender shadow-sm ring-2 ring-purple" : "bg-white/50 hover:bg-white/80"
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
          <div className="text-5xl">{finalSurvived ? "🌤️" : "🌙"}</div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-heading">
            {finalSurvived ? (
              <>
                YOU MADE IT! <span aria-hidden>♡</span>
              </>
            ) : (
              <>
                You took a little break <span aria-hidden>♡</span>
              </>
            )}
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
              Jumped/ducked past positive: {finalStats.positiveDodged}
            </div>
            <div className="rounded-xl bg-butter px-3 py-2 text-butter-text">
              Jumped/ducked past negative: {finalStats.negativeDodged}
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
        <div className="flex items-center gap-2">
          <span className="font-heading text-xs font-bold uppercase tracking-wide text-heading">
            <span aria-hidden>♡</span> Energy
          </span>
          <div className="flex gap-0.5" aria-label={`${hearts} of 10 energy`}>
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className={i < hearts ? "text-blush-strong" : "text-black/10"}>
                ●
              </span>
            ))}
          </div>
        </div>
        <p className="font-heading text-lg font-bold text-heading">
          {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
        </p>
      </div>

      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
        className={`relative h-96 overflow-hidden rounded-[24px] border border-black/5 bg-gradient-to-b select-none ${environment.sky} transition ${
          flash === "bad" ? "ring-4 ring-blush-strong" : flash === "good" ? "ring-4 ring-mint" : ""
        }`}
      >
        {/* scrolling ground strip, sells the side-scrolling motion */}
        <div
          aria-hidden
          className={`animate-ground-scroll absolute bottom-0 h-4 w-full ${environment.ground}`}
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 10px, transparent 10px 32px)",
          }}
        />

        {obstacle && (
          <div
            className={`absolute flex w-32 min-h-16 -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-center text-xs font-semibold shadow-md ${obstacle.colorClass}`}
            style={{
              left: `${obstacleX}%`,
              bottom: obstacle.kind === "low" ? "16px" : "88px",
            }}
          >
            <span aria-hidden className="text-sm leading-none">
              {obstacle.kind === "low" ? "⤴" : "⤵"}
            </span>
            &quot;{obstacle.remark}&quot;
          </div>
        )}

        <div
          className="absolute bottom-4 -translate-x-1/2"
          style={{ left: `${PLAYER_X}%` }}
        >
          <AnimalAvatar animal={animal} pose={pose} size={84} />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button variant="sky" onClick={doJump}>
          ⤴ Jump
        </Button>
        <Button variant="mint" onClick={doDuckTap}>
          ⤵ Duck
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Tap, press Space/↑, or hit Jump to clear thoughts on the ground. Swipe down, press ↓, or hit
        Duck to clear the floating ones. Catch one instead and a kind thought lifts your energy —
        an unkind one dips it just a little, never all at once.
      </p>
    </div>
  );
}
