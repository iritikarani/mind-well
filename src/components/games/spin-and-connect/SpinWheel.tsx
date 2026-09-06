export const SPIN_DURATION_MS = 3200;

interface SpinWheelProps {
  labels: string[];
  rotation: number;
  size?: number;
  colors?: [string, string];
  textColor?: string;
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

export function SpinWheel({
  labels,
  rotation,
  size = 220,
  colors = ["#FFE3EE", "#FFC7DD"],
  textColor = "#6B5B73",
}: SpinWheelProps) {
  const segAngle = 360 / labels.length;
  const r = size / 2;
  const cx = r;
  const cy = r;
  const fontSize = labels.length > 20 ? size * 0.05 : size * 0.072;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute left-1/2 z-10 -translate-x-1/2" style={{ top: -size * 0.07 }}>
        <svg width={size * 0.14} height={size * 0.11} viewBox="0 0 24 20">
          <polygon points="0,0 24,0 12,20" fill="#F6C445" stroke="#FFFDFB" strokeWidth={1} />
        </svg>
      </div>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rounded-full shadow-md"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.15, 0.65, 0.25, 1)`,
        }}
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
  );
}

/**
 * Computes the next cumulative rotation (always increasing, so the CSS
 * transition always spins forward) that lands segment `targetIndex` under
 * the fixed pointer at the top, after a few extra full spins.
 */
export function computeWheelRotation(
  prevRotation: number,
  targetIndex: number,
  segmentCount: number,
  extraSpins = 5,
): number {
  const segAngle = 360 / segmentCount;
  const targetMod = (360 - (((targetIndex + 0.5) * segAngle) % 360)) % 360;
  const prevMod = ((prevRotation % 360) + 360) % 360;
  let delta = targetMod - prevMod;
  if (delta <= 0) delta += 360;
  return prevRotation + delta + extraSpins * 360;
}
