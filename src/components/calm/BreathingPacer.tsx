"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  BREATH_PATTERNS,
  PHASE_LABEL,
  SESSION_MINUTES,
  phaseAt,
} from "@/lib/breathing";
import { playBell } from "@/lib/soundscape";

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

type WakeLockLike = { release: () => Promise<void> };

export function BreathingPacer() {
  const reduced = useReducedMotion();
  const [patternId, setPatternId] = useState("soft");
  const [minutes, setMinutes] = useState<(typeof SESSION_MINUTES)[number]>(3);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const bellCtx = useRef<AudioContext | null>(null);
  const elapsedRef = useRef(0);

  const pattern = BREATH_PATTERNS.find((p) => p.id === patternId) ?? BREATH_PATTERNS[0];
  const total = minutes * 60;
  const state = phaseAt(pattern, elapsed);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      elapsedRef.current += dt;
      if (elapsedRef.current >= total) {
        elapsedRef.current = total;
        setElapsed(total);
        setRunning(false);
        setDone(true);
        if (bellCtx.current) playBell(bellCtx.current);
        return;
      }
      setElapsed(elapsedRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, total]);

  // Keep the screen awake while breathing, where the browser allows it.
  useEffect(() => {
    if (!running) return;
    let lock: WakeLockLike | null = null;
    let cancelled = false;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<WakeLockLike> };
    };
    nav.wakeLock
      ?.request("screen")
      .then((l) => {
        if (cancelled) void l.release();
        else lock = l;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      void lock?.release();
    };
  }, [running]);

  useEffect(() => {
    return () => {
      void bellCtx.current?.close();
    };
  }, []);

  function start() {
    // Created on the tap so the browser allows the closing bell later.
    if (!bellCtx.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) bellCtx.current = new Ctor();
    }
    void bellCtx.current?.resume();
    if (done || elapsedRef.current >= total) {
      elapsedRef.current = 0;
      setElapsed(0);
    }
    setDone(false);
    setRunning(true);
  }

  function reset() {
    setRunning(false);
    elapsedRef.current = 0;
    setElapsed(0);
    setDone(false);
  }

  const idle = !running && elapsed === 0 && !done;
  const scale = reduced ? 0.85 : running || elapsed > 0 ? state.scale : 0.7;
  const remaining = Math.max(0, Math.ceil(total - elapsed));
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");
  const label = done
    ? "That was lovely"
    : idle
      ? "Ready when you are"
      : PHASE_LABEL[state.kind];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Breathing style">
        {BREATH_PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPatternId(p.id);
              reset();
            }}
            aria-pressed={patternId === p.id}
            className={cn(
              "min-h-11 rounded-full border-2 px-4 text-sm font-semibold",
              patternId === p.id
                ? "border-purple bg-lavender text-lavender-text"
                : "border-transparent bg-white/70 text-heading hover:border-lavender-strong",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{pattern.blurb}</p>

      <div className="relative mx-auto mt-6 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-lavender/60"
          style={{ transform: `scale(${0.55 + scale * 0.45})`, opacity: 0.5 + scale * 0.3 }}
        />
        <div
          aria-hidden
          className="absolute inset-6 rounded-full"
          style={{
            transform: `scale(${scale})`,
            background:
              "radial-gradient(circle at 35% 30%, #fff6fb 0%, #ffd2e6 38%, #c9aef2 100%)",
            boxShadow: `0 0 ${20 + scale * 40}px rgba(201,174,242,${0.35 + scale * 0.35})`,
          }}
        />
        <div className="relative z-10 text-center">
          <p aria-live="polite" className="font-heading text-xl font-bold text-heading">
            {label}
          </p>
          {running && (
            <p aria-hidden className="mt-1 font-heading text-4xl font-bold text-purple-text">
              {state.secondsLeft}
            </p>
          )}
          {!idle && !done && (
            <p className="mt-1 text-xs font-semibold text-muted">
              {mm}:{ss} left
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2" role="group" aria-label="Session length">
        {SESSION_MINUTES.map((m) => (
          <button
            key={m}
            type="button"
            disabled={running}
            onClick={() => {
              setMinutes(m);
              reset();
            }}
            aria-pressed={minutes === m}
            className={cn(
              "min-h-11 rounded-full border-2 px-4 text-sm font-semibold disabled:opacity-50",
              minutes === m
                ? "border-purple bg-lavender text-lavender-text"
                : "border-transparent bg-white/70 text-heading hover:border-lavender-strong",
            )}
          >
            {m} min
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {running ? (
          <Button variant="lavender" onClick={() => setRunning(false)}>
            Pause
          </Button>
        ) : (
          <Button onClick={start}>{done ? "Breathe again" : elapsed > 0 ? "Resume" : "Begin"}</Button>
        )}
        {(running || elapsed > 0) && (
          <Button variant="ghost" onClick={reset}>
            Stop
          </Button>
        )}
      </div>

      {done && (
        <p role="status" className="mt-4 text-center text-sm text-muted">
          Notice how you feel now — even a little softer counts. ♡
        </p>
      )}
    </div>
  );
}
