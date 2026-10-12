export type PhaseKind = "in" | "hold-in" | "out" | "hold-out";

export interface BreathPhase {
  kind: PhaseKind;
  seconds: number;
}

export interface BreathPattern {
  id: string;
  label: string;
  blurb: string;
  phases: BreathPhase[];
}

export const BREATH_PATTERNS: BreathPattern[] = [
  {
    id: "soft",
    label: "Soft",
    blurb: "In for 4, out for 6 — the easiest place to start.",
    phases: [
      { kind: "in", seconds: 4 },
      { kind: "out", seconds: 6 },
    ],
  },
  {
    id: "box",
    label: "Box",
    blurb: "4 in, 4 hold, 4 out, 4 hold — steady and grounding.",
    phases: [
      { kind: "in", seconds: 4 },
      { kind: "hold-in", seconds: 4 },
      { kind: "out", seconds: 4 },
      { kind: "hold-out", seconds: 4 },
    ],
  },
  {
    id: "sleep",
    label: "Wind-down",
    blurb: "4 in, 7 hold, 8 out — a slow breath for the end of the day.",
    phases: [
      { kind: "in", seconds: 4 },
      { kind: "hold-in", seconds: 7 },
      { kind: "out", seconds: 8 },
    ],
  },
];

export const SESSION_MINUTES = [1, 3, 5] as const;

export const PHASE_LABEL: Record<PhaseKind, string> = {
  in: "Breathe in",
  "hold-in": "Hold gently",
  out: "Breathe out",
  "hold-out": "Rest",
};

const MIN_SCALE = 0.55;

export function cycleSeconds(pattern: BreathPattern): number {
  return pattern.phases.reduce((sum, p) => sum + p.seconds, 0);
}

export interface PhaseState {
  index: number;
  kind: PhaseKind;
  /** Whole seconds left in this phase (counts down: 4, 3, 2, 1). */
  secondsLeft: number;
  /** 0.55 (lungs empty) to 1 (full) — drives the orb's size. */
  scale: number;
  cycle: number;
}

/** Where the breath is `elapsed` seconds into a session. The orb eases
 * with a sine curve so it swells and settles instead of moving linearly. */
export function phaseAt(pattern: BreathPattern, elapsed: number): PhaseState {
  const total = cycleSeconds(pattern);
  const cycle = Math.floor(elapsed / total);
  let t = elapsed - cycle * total;

  for (let i = 0; i < pattern.phases.length; i++) {
    const phase = pattern.phases[i];
    if (t < phase.seconds || i === pattern.phases.length - 1) {
      const progress = Math.min(1, t / phase.seconds);
      const eased = (1 - Math.cos(progress * Math.PI)) / 2;
      let scale: number;
      if (phase.kind === "in") scale = MIN_SCALE + (1 - MIN_SCALE) * eased;
      else if (phase.kind === "out") scale = 1 - (1 - MIN_SCALE) * eased;
      else if (phase.kind === "hold-in") scale = 1;
      else scale = MIN_SCALE;
      return {
        index: i,
        kind: phase.kind,
        secondsLeft: Math.max(1, Math.ceil(phase.seconds - t)),
        scale,
        cycle,
      };
    }
    t -= phase.seconds;
  }

  return { index: 0, kind: "in", secondsLeft: 1, scale: MIN_SCALE, cycle };
}
