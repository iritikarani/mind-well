"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { PRESETS, SILENT_MIX, SOUNDS, Soundscape, type Mix, type SoundId } from "@/lib/soundscape";

const STORE_KEY = "hs-mix";
const SILENT_JSON = JSON.stringify(SILENT_MIX);

// The saved mix lives in a tiny external store (localStorage with an
// in-memory fallback), so the sliders are correct on the first client paint
// without a hydration mismatch and keep working in private browsing.
let currentMix: string | null = null;
const listeners = new Set<() => void>();

function readMix(): string {
  if (currentMix === null) {
    try {
      currentMix = localStorage.getItem(STORE_KEY) ?? SILENT_JSON;
    } catch {
      currentMix = SILENT_JSON;
    }
  }
  return currentMix;
}

function writeMix(mix: Mix) {
  currentMix = JSON.stringify(mix);
  try {
    localStorage.setItem(STORE_KEY, currentMix);
  } catch {
    // keep it in memory only
  }
  listeners.forEach((l) => l());
}

function subscribeMix(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function parseMix(json: string): Mix {
  try {
    const raw = JSON.parse(json) as Partial<Mix>;
    const mix = { ...SILENT_MIX };
    for (const { id } of SOUNDS) {
      const v = raw[id];
      if (typeof v === "number" && v >= 0 && v <= 1) mix[id] = v;
    }
    return mix;
  } catch {
    return { ...SILENT_MIX };
  }
}

const TIMERS = [0, 15, 30, 60] as const;
const FADE_SECONDS = 20;

export function SoundMixer() {
  const mix = parseMix(useSyncExternalStore(subscribeMix, readMix, () => SILENT_JSON));
  const [playing, setPlaying] = useState(false);
  const [timerMin, setTimerMin] = useState<(typeof TIMERS)[number]>(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const engine = useRef<{ ctx: AudioContext; scape: Soundscape } | null>(null);
  const remainingRef = useRef(0);

  function ensureEngine() {
    if (engine.current) return engine.current;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const scape = new Soundscape(ctx);
    engine.current = { ctx, scape };
    return engine.current;
  }

  async function play(nextMix: Mix) {
    const e = ensureEngine();
    if (!e) return;
    await e.ctx.resume();
    e.scape.restoreMaster();
    e.scape.setMix(nextMix);
    setPlaying(true);
    if (timerMin > 0) {
      remainingRef.current = timerMin * 60;
      setRemaining(timerMin * 60);
    }
  }

  function hasSound(m: Mix) {
    return SOUNDS.some(({ id }) => m[id] > 0.01);
  }

  function setVolume(id: SoundId, value: number) {
    const next = { ...mix, [id]: value };
    writeMix(next);
    if (!playing && value > 0) void play(next);
    else engine.current?.scape.setVolume(id, value);
  }

  function togglePlay() {
    if (playing) {
      void engine.current?.ctx.suspend();
      setPlaying(false);
      setRemaining(null);
    } else {
      const m = hasSound(mix) ? mix : PRESETS[0].mix;
      if (m !== mix) writeMix(m);
      void play(m);
    }
  }

  function applyPreset(m: Mix) {
    writeMix(m);
    void play(m);
  }

  function chooseTimer(min: (typeof TIMERS)[number]) {
    setTimerMin(min);
    remainingRef.current = min * 60;
    setRemaining(min > 0 && playing ? min * 60 : null);
    engine.current?.scape.restoreMaster();
  }

  useEffect(() => {
    if (!playing || timerMin === 0) return;
    const id = setInterval(() => {
      remainingRef.current -= 1;
      const r = remainingRef.current;
      if (r === FADE_SECONDS) engine.current?.scape.fadeOut(FADE_SECONDS);
      if (r <= 0) {
        clearInterval(id);
        void engine.current?.ctx.suspend();
        engine.current?.scape.restoreMaster();
        setPlaying(false);
        setRemaining(null);
        return;
      }
      setRemaining(r);
    }, 1000);
    return () => clearInterval(id);
  }, [playing, timerMin]);

  useEffect(() => {
    return () => {
      engine.current?.scape.dispose();
      void engine.current?.ctx.close();
      engine.current = null;
    };
  }, []);

  const left =
    remaining !== null && remaining > 0
      ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
      : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Soundscape presets">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.mix)}
            className="pixel-pressable flex min-h-11 items-center gap-1.5 rounded-full bg-lavender px-4 text-sm font-semibold text-lavender-text hover:bg-lavender-strong"
          >
            <span aria-hidden>{p.emoji}</span> {p.label}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-1">
        {SOUNDS.map(({ id, label, emoji }) => (
          <li key={id} className="flex items-center gap-3">
            <label htmlFor={`mix-${id}`} className="flex w-36 shrink-0 items-center gap-2 text-sm font-semibold text-heading">
              <span aria-hidden className="text-lg">
                {emoji}
              </span>
              {label}
            </label>
            <input
              id={`mix-${id}`}
              type="range"
              min={0}
              max={100}
              value={Math.round(mix[id] * 100)}
              onChange={(e) => setVolume(id, Number(e.target.value) / 100)}
              aria-valuetext={`${Math.round(mix[id] * 100)} percent`}
              className="h-11 w-full cursor-pointer accent-purple"
            />
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant={playing ? "lavender" : "primary"} onClick={togglePlay}>
          {playing ? "Pause sounds" : "Play sounds"}
        </Button>
        {hasSound(mix) && (
          <Button
            variant="ghost"
            onClick={() => {
              writeMix({ ...SILENT_MIX });
              engine.current?.scape.setMix(SILENT_MIX);
            }}
          >
            Silence all
          </Button>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Fade out after</p>
        <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Sleep timer">
          {TIMERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => chooseTimer(t)}
              aria-pressed={timerMin === t}
              className={cn(
                "min-h-11 rounded-full border-2 px-4 text-sm font-semibold",
                timerMin === t
                  ? "border-purple bg-lavender text-lavender-text"
                  : "border-transparent bg-white/70 text-heading hover:border-lavender-strong",
              )}
            >
              {t === 0 ? "Keep playing" : `${t} min`}
            </button>
          ))}
          {left && (
            <span role="timer" className="text-xs font-semibold text-muted">
              {left} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
