"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/cn";

interface SpinWheelProps {
  labels: string[];
  size?: number;
  colors?: [string, string];
  textColor?: string;
  disabled?: boolean;
  /** Fires once the wheel's physics-driven spin comes to rest, with the
   * index of the segment under the fixed top pointer. */
  onSettle: (index: number) => void;
}

// Rounded to 2 decimals so the exact same angle always serializes to the
// same string — full float precision can differ in the last few digits
// between the server's and browser's Math.sin/cos, which otherwise causes
// a hydration mismatch on these SVG path coordinates.
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function point(cx: number, cy: number, angleDeg: number, radius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [round(cx + radius * Math.sin(rad)), round(cy - radius * Math.cos(rad))];
}

// Exponential-decay friction, applied per real elapsed ms (frame-rate
// independent): v(t) = v0 * FRICTION_PER_MS^t. Tuned (and verified with a
// standalone calculation before picking this constant) so a moderate flick
// (~2 deg/ms) spins for about 4 seconds across 5 full rotations, similar in
// feel to the original fixed 3.2s auto-spin but responsive to how hard the
// player actually flicks.
const FRICTION_PER_MS = 0.99895;
const MIN_VELOCITY_DEG_PER_MS = 0.03;
const MIN_FLING_DEG_PER_MS = 1.5;
const VELOCITY_SAMPLE_WINDOW_MS = 120;

function angleFromCenter(clientX: number, clientY: number, rect: DOMRect): number {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  // Matches point()'s convention: 0deg = up, increasing clockwise.
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

export function SpinWheel({
  labels,
  size = 220,
  colors = ["#FFE3EE", "#FFC7DD"],
  textColor = "#6B5B73",
  disabled = false,
  onSettle,
}: SpinWheelProps) {
  const segAngle = 360 / labels.length;
  const r = size / 2;
  const cx = r;
  const cy = r;
  const fontSize = labels.length > 20 ? size * 0.05 : size * 0.072;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const rotationRef = useRef(0);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);
  const lastPointerAngleRef = useRef(0);
  const samplesRef = useRef<{ rotation: number; t: number }[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // onSettle closes over the parent's current stage/ready-state at the time
  // it's created, and a spin can take several seconds — reading it through a
  // ref (always kept current) instead of capturing it directly in `settle`
  // means a finished spin calls whatever the latest handler actually is,
  // not whichever one happened to exist when this component first mounted.
  const onSettleRef = useRef(onSettle);
  useEffect(() => {
    onSettleRef.current = onSettle;
  });

  const settle = useCallback(() => {
    const localAngleAtTop = ((-rotationRef.current % 360) + 360) % 360;
    const idx = Math.floor(localAngleAtTop / segAngle) % labels.length;
    setSpinning(false);
    onSettleRef.current(idx);
  }, [segAngle, labels.length]);

  const runFriction = useCallback(
    (initialVelocity: number) => {
      let velocity = initialVelocity;
      let last = performance.now();

      function tick(now: number) {
        const dt = now - last;
        last = now;
        velocity *= Math.pow(FRICTION_PER_MS, dt);
        rotationRef.current += velocity * dt;
        setRotation(rotationRef.current);

        if (Math.abs(velocity) < MIN_VELOCITY_DEG_PER_MS) {
          settle();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [settle],
  );

  function handlePointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (disabled || spinning) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    draggingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    lastPointerAngleRef.current = angleFromCenter(e.clientX, e.clientY, rect);
    samplesRef.current = [{ rotation: rotationRef.current, t: performance.now() }];
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!draggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const angle = angleFromCenter(e.clientX, e.clientY, rect);
    let delta = angle - lastPointerAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    rotationRef.current += delta;
    lastPointerAngleRef.current = angle;
    setRotation(rotationRef.current);

    const now = performance.now();
    samplesRef.current.push({ rotation: rotationRef.current, t: now });
    samplesRef.current = samplesRef.current.filter((s) => now - s.t <= VELOCITY_SAMPLE_WINDOW_MS);
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const samples = samplesRef.current;
    let velocity = 0;
    if (samples.length >= 2) {
      const first = samples[0];
      const lastSample = samples[samples.length - 1];
      const dt = lastSample.t - first.t;
      if (dt > 0) velocity = (lastSample.rotation - first.rotation) / dt;
    }

    // A plain tap (no real drag) should still give a satisfying spin rather
    // than feel broken — treat it as a randomized medium-strength fling.
    if (Math.abs(velocity) < MIN_FLING_DEG_PER_MS) {
      const direction = velocity >= 0 ? 1 : Math.random() < 0.5 ? -1 : 1;
      velocity = direction * (MIN_FLING_DEG_PER_MS + Math.random() * 1.5);
    }

    setSpinning(true);
    runFriction(velocity);
  }

  return (
    // `size` is only an upper bound and the coordinate space the geometry
    // above is computed in — the box itself is fluid (w-full, capped by
    // maxWidth, height matched via aspect-square) so it shrinks to fit a
    // narrow mobile card instead of overflowing it at a fixed pixel size.
    // The SVG scales visually to fill that box while keeping its viewBox,
    // so every angle/point computed above still lines up; pointer math reads
    // the actual on-screen rect, so dragging isn't affected by the scale.
    <div className="mx-auto w-full select-none" style={{ maxWidth: size }}>
      {/* relative (not the outer div) so this has a definite height via
          aspect-square — a percentage `top` on the absolute triangle below
          needs that, since an auto-height ancestor resolves percentages to 0. */}
      <div className="relative aspect-square w-full">
        <div className="absolute left-1/2 z-10 -translate-x-1/2" style={{ top: "-7%", width: "14%" }}>
          <svg width="100%" viewBox="0 0 24 20">
            <polygon points="0,0 24,0 12,20" fill="#F6C445" stroke="#FFFDFB" strokeWidth={1} />
          </svg>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${size} ${size}`}
          className={cn(
            "h-full w-full rounded-full shadow-md touch-none",
            disabled ? "cursor-default opacity-60" : spinning ? "cursor-default" : "cursor-grab active:cursor-grabbing",
          )}
          style={{ transform: `rotate(${rotation}deg)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {labels.map((label, i) => {
            const start = i * segAngle;
            const end = (i + 1) * segAngle;
            const mid = start + segAngle / 2;
            const [x1, y1] = point(cx, cy, start, r);
            const [x2, y2] = point(cx, cy, end, r);
            const [lx, ly] = point(cx, cy, mid, r * 0.6);
            const fill = colors[i % 2];

            return (
              <g key={i}>
                <path
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill={fill}
                  stroke="#FFFDFB"
                  strokeWidth={1.5}
                />
                <text
                  x={lx}
                  y={ly}
                  fontSize={fontSize}
                  fontWeight={700}
                  fill={textColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${lx}, ${ly})`}
                >
                  {label}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={size * 0.045} fill="#FFFDFB" stroke={textColor} strokeWidth={1.5} />
        </svg>
      </div>
    </div>
  );
}
