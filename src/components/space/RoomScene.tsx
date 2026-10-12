"use client";

import Link from "next/link";
import { useId } from "react";
import {
  SKY,
  lampGlow,
  roomDim,
  skyTimeFor,
  weatherForMood,
  type PlantStage,
  type TimeOfDay,
} from "@/lib/room";

export interface RoomPostcard {
  id: string;
  name: string;
}

export interface RoomSceneProps {
  mood: string | null;
  timeOfDay: TimeOfDay;
  postcards: RoomPostcard[];
  badgeCount: number;
  plantStage: PlantStage;
  journalToday: boolean;
  letterWaiting: boolean;
  onMailbox: () => void;
}

const MEDAL_COLORS = ["#ffd98a", "#ffabd4", "#9fe0b8", "#a6d8f4", "#c9aef2"];
const BULB_COLORS = ["#ffabd4", "#ffd98a", "#a6d8f4", "#b8e8c6", "#c9aef2"];

// Pre-rounded so server and browser render byte-identical coordinates
// (floating-point sin/cos can differ in the last digits and break hydration).
const PETALS: [number, number][] = [
  [3.6, 0],
  [1.11, 3.42],
  [-2.91, 2.12],
  [-2.91, -2.12],
  [1.11, -3.42],
];

const POSTCARD_SLOTS = [
  { x: 19, y: 55, r: -6 },
  { x: 50, y: 62, r: 3 },
  { x: 80, y: 56, r: -3 },
  { x: 28, y: 101, r: 4 },
  { x: 66, y: 106, r: -5 },
];

function HotLabel({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 5.4 + 14;
  return (
    <g className="room-label">
      <rect x={x - w / 2} y={y - 9} width={w} height={16} rx={8} fill="#5b4b73" opacity={0.92} />
      <text
        x={x}
        y={y + 2.5}
        textAnchor="middle"
        fontSize={8.5}
        fontWeight={700}
        fill="#fffdf8"
        fontFamily="var(--font-quicksand), sans-serif"
      >
        {text}
      </text>
    </g>
  );
}

function Cloud({ x, y, s, fill, delay }: { x: number; y: number; s: number; fill: string; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="room-cloud" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx={0} cy={0} rx={17} ry={6} fill={fill} />
        <circle cx={-6} cy={-5} r={7} fill={fill} />
        <circle cx={5} cy={-7} r={9} fill={fill} />
      </g>
    </g>
  );
}

function Leaf({ angle, len, shade }: { angle: number; len: number; shade: string }) {
  return (
    <ellipse
      cx={0}
      cy={-len / 2}
      rx={Math.max(3, len * 0.22)}
      ry={len / 2}
      fill={shade}
      transform={`rotate(${angle})`}
    />
  );
}

const LEAF_SETS: Record<PlantStage, { angle: number; len: number }[]> = {
  0: [
    { angle: -34, len: 12 },
    { angle: 0, len: 15 },
    { angle: 34, len: 12 },
  ],
  1: [
    { angle: -40, len: 14 },
    { angle: 0, len: 17 },
    { angle: 40, len: 14 },
  ],
  2: [
    { angle: -58, len: 17 },
    { angle: -28, len: 22 },
    { angle: 0, len: 25 },
    { angle: 28, len: 22 },
    { angle: 58, len: 17 },
  ],
  3: [
    { angle: -66, len: 20 },
    { angle: -44, len: 27 },
    { angle: -20, len: 32 },
    { angle: 0, len: 35 },
    { angle: 20, len: 32 },
    { angle: 44, len: 27 },
    { angle: 66, len: 20 },
  ],
  4: [
    { angle: -70, len: 22 },
    { angle: -50, len: 30 },
    { angle: -28, len: 35 },
    { angle: -9, len: 40 },
    { angle: 9, len: 40 },
    { angle: 28, len: 35 },
    { angle: 50, len: 30 },
    { angle: 70, len: 22 },
  ],
};

function Plant({ stage }: { stage: PlantStage }) {
  const leaves = LEAF_SETS[stage];
  const flowers =
    stage === 4
      ? [
          { x: -24, y: -38 },
          { x: 4, y: -46 },
          { x: 27, y: -36 },
        ]
      : [];
  return (
    <g>
      <g transform="translate(368 254)">
        <g className="room-sway">
          {leaves.map((l, i) => (
            <Leaf key={i} angle={l.angle} len={l.len} shade={i % 2 === 0 ? "#79cc96" : "#9bdcb0"} />
          ))}
          {flowers.map((f, i) => (
            <g key={i} transform={`translate(${f.x} ${f.y})`}>
              {PETALS.map(([px, py], j) => (
                <circle key={j} cx={px} cy={py} r={2.8} fill="#ffabd4" />
              ))}
              <circle r={2.2} fill="#ffd98a" />
            </g>
          ))}
        </g>
      </g>
      <path d="M352 254 H384 L380 284 Q368 288 356 284 Z" fill="#e59a72" />
      <rect x={349} y={251} width={38} height={7} rx={3} fill="#d9825a" />
      <ellipse cx={368} cy={253} rx={15} ry={2.4} fill="#7a5238" opacity={0.55} />
    </g>
  );
}

export function RoomScene({
  mood,
  timeOfDay,
  postcards,
  badgeCount,
  plantStage,
  journalToday,
  letterWaiting,
  onMailbox,
}: RoomSceneProps) {
  const uid = useId().replace(/:/g, "");
  const weather = weatherForMood(mood);
  const skyTime = skyTimeFor(timeOfDay, mood);
  const sky = SKY[skyTime];
  const dim = roomDim(skyTime, weather);
  const glow = lampGlow(skyTime);
  const night = skyTime === "night";
  const cloudFill = weather.rain ? "#c9d2ea" : skyTime === "dusk" ? "#ffe3d6" : night ? "#6c68b0" : "#ffffff";
  const medals = Math.min(badgeCount, 4);
  const beamOpacity = skyTime === "night" ? 0 : (skyTime === "day" ? 0.5 : 0.35) * (weather.rain ? 0.45 : 1);

  const bulbs = Array.from({ length: 10 }, (_, i) => {
    const x = 14 + i * 41;
    const y = Math.round((13 + Math.sin(i * 1.3) * 3 + (i % 2) * 5) * 100) / 100;
    return { x, y, color: BULB_COLORS[i % BULB_COLORS.length] };
  });

  const windowArch = "M128 152 V86 A62 62 0 0 1 252 86 V152 Z";
  const windowInner = "M136 148 V86 A54 54 0 0 1 244 86 V148 Z";

  return (
    <svg
      viewBox="0 0 400 300"
      role="group"
      aria-label="Your room"
      className="block h-auto w-full select-none"
    >
      <defs>
        <linearGradient id={`${uid}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe5fb" />
          <stop offset="1" stopColor="#fbf3ff" />
        </linearGradient>
        <linearGradient id={`${uid}floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6d2" />
          <stop offset="1" stopColor="#ffd2b3" />
        </linearGradient>
        <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <filter id={`${uid}soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id={`${uid}beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTime === "day" ? "#fffbe0" : "#ffd9b8"} stopOpacity={beamOpacity} />
          <stop offset="1" stopColor={skyTime === "day" ? "#fffbe0" : "#ffd9b8"} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${uid}glow`}>
          <stop offset="0" stopColor="#ffd98a" stopOpacity={0.75} />
          <stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
        </radialGradient>
        <pattern id={`${uid}dots`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.3" fill="#ffffff" opacity="0.55" />
          <circle cx="15" cy="15" r="1.3" fill="#ffffff" opacity="0.4" />
        </pattern>
        <clipPath id={`${uid}win`}>
          <path d={windowInner} />
        </clipPath>
        <clipPath id={`${uid}card`}>
          <rect x="0" y="0" width="22" height="15" rx="2" />
        </clipPath>
      </defs>

      {/* Wall and floor */}
      <rect width="400" height="215" fill={`url(#${uid}wall)`} />
      <rect width="400" height="215" fill={`url(#${uid}dots)`} />
      <rect y="196" width="400" height="19" fill="#e6d8f7" />
      <rect y="213" width="400" height="3" fill="#cfbbec" />
      <rect y="216" width="400" height="84" fill={`url(#${uid}floor)`} />
      {[236, 256, 277].map((y) => (
        <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="#f4b995" strokeWidth="1" opacity="0.55" />
      ))}
      {[60, 150, 250, 340, 100, 200, 300, 30, 380].map((x, i) => (
        <line key={i} x1={x} x2={x} y1={[216, 236, 256][i % 3]} y2={[236, 256, 277][i % 3]} stroke="#f4b995" strokeWidth="1" opacity="0.45" />
      ))}

      {/* Light shaft from the window */}
      <polygon points="146,156 234,156 318,292 76,292" fill={`url(#${uid}beam)`} filter={`url(#${uid}soft)`} />

      {/* Fairy lights */}
      <path
        d={`M-4 8 ${bulbs.map((b) => `Q ${b.x - 20} ${b.y + 8} ${b.x} ${b.y}`).join(" ")} L 404 10`}
        fill="none"
        stroke="#b9a3dd"
        strokeWidth="1.2"
      />
      {bulbs.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y + 4} r={night ? 6 : 3.5} fill={b.color} opacity={night ? 0.35 : 0} />
          <circle
            cx={b.x}
            cy={b.y + 4}
            r={2.6}
            fill={b.color}
            opacity={night ? 1 : 0.75}
            className={night ? "room-twinkle" : undefined}
            style={night ? { animationDelay: `${i * 0.35}s` } : undefined}
          />
        </g>
      ))}

      {/* Window */}
      <g>
        <path d={windowArch} fill="#fffdf8" stroke="#e3d6f5" strokeWidth="2" />
        <g clipPath={`url(#${uid}win)`}>
          <rect x="130" y="26" width="120" height="126" fill={`url(#${uid}sky)`} />

          {night && (
            <>
              {[
                [150, 48],
                [172, 38],
                [196, 70],
                [230, 44],
                [162, 82],
                [238, 86],
                [210, 34],
                [182, 56],
              ].map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={i % 3 === 0 ? 1.6 : 1.1}
                  fill="#fff6d6"
                  className="room-twinkle"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              ))}
              <path d="M216 46 a10 10 0 1 0 0 20 a8 8 0 1 1 0 -20z" fill="#fff6d6" />
            </>
          )}
          {skyTime === "day" && (
            <>
              <circle cx="212" cy="58" r="22" fill="#fff3a8" opacity="0.35" />
              <circle cx="212" cy="58" r="11" fill="#ffe27a" />
            </>
          )}
          {skyTime === "dawn" && (
            <>
              <circle cx="166" cy="116" r="22" fill="#fff0d6" opacity="0.5" />
              <circle cx="166" cy="116" r="12" fill="#ffc79a" />
            </>
          )}
          {skyTime === "dusk" && (
            <>
              <circle cx="224" cy="116" r="24" fill="#ffd9a8" opacity="0.45" />
              <circle cx="224" cy="116" r="12" fill="#ffb36b" />
            </>
          )}

          {weather.birds && skyTime === "day" && (
            <g fill="none" stroke="#5b4b73" strokeWidth="1.1" strokeLinecap="round">
              <path className="room-bird" d="M0 44 q3 -3 6 0 q3 -3 6 0" />
              <path className="room-bird" style={{ animationDelay: "-9s" }} d="M0 60 q2.5 -2.5 5 0 q2.5 -2.5 5 0" />
            </g>
          )}

          {Array.from({ length: weather.clouds }).map((_, i) => (
            <Cloud
              key={i}
              x={[158, 224, 178][i]}
              y={[58, 86, 102][i]}
              s={[1, 0.82, 0.7][i]}
              fill={cloudFill}
              delay={-i * 4}
            />
          ))}

          <path d="M130 128 Q160 106 190 122 T250 114 V152 H130Z" fill={sky.hillFar} />
          <path d="M130 140 Q172 120 212 136 T250 130 V152 H130Z" fill={sky.hill} />
          <rect x="151" y="124" width="2.2" height="9" fill="#7a5a3a" />
          <circle cx="152" cy="121" r="6" fill={night ? "#3d3d85" : "#86cf9d"} />

          {weather.sparkles &&
            [
              [150, 62],
              [236, 52],
              [176, 90],
              [228, 98],
              [200, 40],
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path
                  d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1Z"
                  fill="#fff3a8"
                  className="room-twinkle"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              </g>
            ))}

          {weather.rain && (
            <>
              <rect x="130" y="26" width="120" height="126" fill="#7f8fb5" opacity="0.28" />
              {Array.from({ length: 17 }).map((_, i) => (
                <line
                  key={i}
                  x1={138 + i * 6.6}
                  x2={136 + i * 6.6}
                  y1={30}
                  y2={40}
                  stroke="#d3e4fb"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  className="room-rain"
                  style={{
                    animationDelay: `${((i * 37) % 11) / 10}s`,
                    animationDuration: `${0.85 + (i % 3) * 0.18}s`,
                  }}
                />
              ))}
            </>
          )}

          {weather.mist && (
            <>
              <ellipse className="room-cloud" cx="190" cy="118" rx="70" ry="9" fill="#ffffff" opacity="0.5" />
              <ellipse className="room-cloud" style={{ animationDelay: "-6s" }} cx="196" cy="98" rx="60" ry="7" fill="#ffffff" opacity="0.4" />
            </>
          )}

          <polygon points="136,148 176,148 214,30 160,30" fill="#ffffff" opacity="0.1" />
        </g>
        <line x1="190" y1="30" x2="190" y2="150" stroke="#fffdf8" strokeWidth="3.5" />
        <line x1="132" y1="98" x2="248" y2="98" stroke="#fffdf8" strokeWidth="3.5" />
        <rect x="119" y="150" width="142" height="9" rx="3" fill="#fffdf8" />
        <rect x="121" y="159" width="138" height="3" rx="1.5" fill="#5b4b73" opacity="0.1" />

        <rect x="146" y="141" width="13" height="9" rx="2" fill="#e59a72" />
        <ellipse cx="152.5" cy="136" rx="3" ry="6" fill="#79cc96" transform="rotate(-20 152.5 136)" />
        <ellipse cx="152.5" cy="136" rx="3" ry="7" fill="#9bdcb0" transform="rotate(18 152.5 136)" />

        {/* Curtains */}
        <rect x="96" y="21" width="188" height="4" rx="2" fill="#c9aef2" />
        <circle cx="96" cy="23" r="4" fill="#b392ea" />
        <circle cx="284" cy="23" r="4" fill="#b392ea" />
        {[0, 1].map((side) => (
          <g key={side} transform={side === 1 ? "translate(380 0) scale(-1 1)" : undefined}>
            <path d="M100 25 H133 V153 Q112 148 109 120 Q104 80 100 25 Z" fill="#ffc9df" />
            <path d="M112 26 Q116 80 119 148" stroke="#f5a9c8" strokeWidth="1.4" fill="none" />
            <path d="M123 26 Q126 80 127 150" stroke="#f5a9c8" strokeWidth="1.4" fill="none" />
            <ellipse cx="116" cy="112" rx="9" ry="3.4" fill="#ffabd4" />
          </g>
        ))}
      </g>

      {/* Postcard wall → My World */}
      <Link href="/games/world-puzzle/my-world" className="room-hot" aria-label="Your postcards — open My World">
        <rect className="room-ring" x="12" y="40" width="104" height="92" rx="8" fill="none" stroke="#7b5bc7" strokeWidth="1.6" strokeDasharray="4 3" />
        <rect x="12" y="40" width="104" height="92" rx="8" fill="transparent" />
        <g className="room-body">
          <path d="M14 52 Q62 72 114 50" stroke="#b9a3dd" strokeWidth="1.3" fill="none" />
          <path d="M14 98 Q62 116 114 96" stroke="#b9a3dd" strokeWidth="1.3" fill="none" />
          {POSTCARD_SLOTS.map((slot, i) => {
            const card = postcards[i];
            return (
              <g key={i} transform={`translate(${slot.x} ${slot.y}) rotate(${slot.r} 13 9)`}>
                {card ? (
                  <>
                    <rect x="-2" y="-2" width="30" height="23" rx="3" fill="#fffdf8" stroke="#e6dbf5" strokeWidth="0.8" />
                    <g transform="translate(2 1)" clipPath={`url(#${uid}card)`}>
                      <image
                        href={`/monuments/thumbs/${card.id}.jpg`}
                        width="22"
                        height="15"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </g>
                    <circle cx="13" cy="-2" r="1.9" fill="#ff8fb1" />
                    <title>{card.name}</title>
                  </>
                ) : (
                  <>
                    <rect x="-2" y="-2" width="30" height="23" rx="3" fill="#ffffff" opacity="0.35" stroke="#cdb9ec" strokeWidth="0.9" strokeDasharray="2.5 2" />
                    <path d="M13 12 c-3 -2 -4 -5 -2 -6.200 c1.200 -.8 2 0 2 0.800 c0 -.8 .8 -1.600 2 -.8 c2 1.200 1 4.200 -2 6.200z" fill="#cdb9ec" />
                  </>
                )}
              </g>
            );
          })}
        </g>
        <HotLabel x={64} y={36} text="Postcards" />
      </Link>

      {/* Shelf → Badges */}
      <Link href="/badges" className="room-hot" aria-label={`Your badge shelf — ${badgeCount} badge${badgeCount === 1 ? "" : "s"}`}>
        <rect className="room-ring" x="260" y="52" width="134" height="52" rx="8" fill="none" stroke="#7b5bc7" strokeWidth="1.6" strokeDasharray="4 3" />
        <rect x="260" y="52" width="134" height="52" rx="8" fill="transparent" />
        <g className="room-body">
          <rect x="267" y="67" width="5.5" height="15" rx="1" fill="#f4a6c6" />
          <rect x="273" y="71" width="5" height="11" rx="1" fill="#a6d8f4" />
          <rect x="278.500" y="65" width="5.500" height="17" rx="1" fill="#b8e8c6" transform="rotate(7 281 82)" />
          {[0, 1, 2, 3].map((i) => {
            const cx = 303 + i * 17;
            const earned = i < medals;
            return (
              <g key={i}>
                {earned ? (
                  <>
                    <path d={`M${cx - 4} 62 L${cx} 72 L${cx + 4} 62 Z`} fill="#ff8fb1" />
                    <circle cx={cx} cy={74} r={7} fill={MEDAL_COLORS[i % MEDAL_COLORS.length]} stroke="#fffdf8" strokeWidth="1.4" />
                    <path
                      d={`M${cx} ${70.200} l1.400 2.800 3.100 .4 -2.250 2.200 .55 3.100 -2.800 -1.500 -2.800 1.500 .55 -3.100 -2.250 -2.200 3.100 -.4z`}
                      fill="#fffdf8"
                    />
                  </>
                ) : (
                  <circle cx={cx} cy={76} r={6} fill="#ffffff" opacity="0.35" stroke="#cdb9ec" strokeWidth="1" strokeDasharray="2 2" />
                )}
              </g>
            );
          })}
          {/* the little hair-house mascot */}
          <g transform="translate(367 59) scale(0.32)">
            <rect x="13" y="29" width="38" height="27" rx="7" fill="#FFE2CF" />
            <path d="M5 38L32 11l27 27c0 5-3 10-6 13-1-4-1-7-3-11-8 2-14-1-18-7-4 6-10 9-18 7-2 4-2 7-3 11-3-3-6-8-6-13z" fill="#7B5BC7" />
            <path d="M22 42q2.5-3 5 0M37 42q2.5-3 5 0" fill="none" stroke="#4A3A73" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M28.500 47q3.500 3.500 7 0" fill="none" stroke="#4A3A73" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="19.500" cy="47" r="2.600" fill="#FFB3C7" />
            <circle cx="44.500" cy="47" r="2.600" fill="#FFB3C7" />
          </g>
        </g>
        <rect x="258" y="82" width="136" height="6" rx="2.500" fill="#e2ad7a" />
        <rect x="258" y="86" width="136" height="2.500" rx="1" fill="#c88e5a" />
        <path d="M268 88 v9 h9 z M378 88 v9 h-9 z" fill="#d49a66" />
        <HotLabel x={327} y={48} text="Badges" />
      </Link>

      {/* Second shelf: clock, cactus, candle */}
      <g>
        <rect x="262" y="124" width="128" height="6" rx="2.500" fill="#e2ad7a" />
        <rect x="262" y="128" width="128" height="2.500" rx="1" fill="#c88e5a" />
        <path d="M272 130 v8 h8 z M372 130 v8 h-8 z" fill="#d49a66" />
        <circle cx="290" cy="112" r="10" fill="#fffdf8" stroke="#e3d0f2" strokeWidth="2" />
        <line x1="290" y1="112" x2="290" y2="105.500" stroke="#5b4b73" strokeWidth="1.400" strokeLinecap="round" />
        <line x1="290" y1="112" x2="295" y2="114" stroke="#5b4b73" strokeWidth="1.400" strokeLinecap="round" />
        <circle cx="290" cy="112" r="1.200" fill="#ff8fb1" />
        <rect x="324" y="116" width="11" height="8" rx="2" fill="#f5b0c6" />
        <rect x="327.500" y="104" width="4.600" height="13" rx="2.300" fill="#79cc96" />
        <rect x="322.800" y="108" width="4" height="7" rx="2" fill="#79cc96" transform="rotate(-18 324 114)" />
        <rect x="333" y="109" width="4" height="7" rx="2" fill="#9bdcb0" transform="rotate(18 335 114)" />
        <rect x="358" y="113" width="13" height="11" rx="3" fill="#fff3d6" stroke="#ead9b4" strokeWidth="1" />
        <rect x="362" y="109" width="5" height="5" fill="#fff9ec" />
        <path className="room-flicker" d="M364.500 108 q-2.400 -3.500 0 -7 q2.400 3.500 0 7z" fill="#ffcf5c" />
        <path className="room-flicker" d="M364.500 107.500 q-1 -1.800 0 -3.600 q1 1.800 0 3.600z" fill="#fffbe6" />
      </g>

      {/* Desk → Journal */}
      <rect x="272" y="172" width="4.500" height="43" fill="#d49a66" />
      <rect x="384" y="172" width="4.500" height="43" fill="#d49a66" />
      <rect x="266" y="166" width="128" height="8" rx="3" fill="#e8b88a" />
      <rect x="266" y="172" width="128" height="3" rx="1.500" fill="#cc9566" />
      <Link href="/games/three-things" className="room-hot" aria-label="Your journal — Tiny Treasures">
        <rect className="room-ring" x="286" y="140" width="58" height="30" rx="7" fill="none" stroke="#7b5bc7" strokeWidth="1.600" strokeDasharray="4 3" />
        <rect x="286" y="140" width="58" height="30" rx="7" fill="transparent" />
        <g className="room-body">
          <rect x="293" y="163" width="46" height="4" rx="2" fill="#b79ae6" />
          <path d="M295 163 V150 Q307 146 317 150.500 V163 Z" fill="#fffdf8" />
          <path d="M317 150.500 Q327 146 338 150 V163 H317 Z" fill="#fff4e6" />
          <path d="M300 155 H312 M300 158.500 H310 M322 155 H333 M322 158.500 H331" stroke="#d9cdee" strokeWidth="1.200" strokeLinecap="round" />
          <path d="M327 148 v10 l2.500 -2.200 2.500 2.200 v-10.500z" fill="#ff8fb1" />
          {journalToday && (
            <path
              d="M316 134 l2 4.200 4.600 .6 -3.300 3.200 .8 4.600 -4.100 -2.200 -4.100 2.200 .8 -4.600 -3.300 -3.200 4.600 -.6z"
              fill="#ffd98a"
              className="room-twinkle"
            />
          )}
        </g>
        <HotLabel x={316} y={132} text={journalToday ? "Tiny Treasures ✓" : "Tiny Treasures"} />
      </Link>
      <rect x="351" y="157" width="12" height="10" rx="3" fill="#ffc9df" />
      <path d="M363 159 q5 1 0 6" stroke="#ffc9df" strokeWidth="2" fill="none" />
      {[0, 1].map((i) => (
        <path
          key={i}
          className="room-steam"
          style={{ animationDelay: `${i * 1.4}s` }}
          d={`M${355 + i * 4} 154 q-2 -3 0 -5 q2 -3 0 -5`}
          stroke="#ffffff"
          strokeWidth="1.400"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}
      <ellipse cx="378" cy="166" rx="8" ry="2.500" fill="#b79ae6" />
      <rect x="377" y="142" width="2" height="24" fill="#b79ae6" />
      <path d="M368 146 L388 146 L384 133 L372 133 Z" fill={glow > 0.4 ? "#ffe9a8" : "#ffe9b8"} />

      {/* Mailbox → daily letter */}
      <g
        className="room-hot"
        role="button"
        tabIndex={0}
        aria-label={letterWaiting ? "Today's letter is waiting — open the mailbox" : "Open the mailbox to read today's letter again"}
        onClick={onMailbox}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onMailbox();
          }
        }}
      >
        <rect className="room-ring" x="14" y="162" width="52" height="72" rx="8" fill="none" stroke="#7b5bc7" strokeWidth="1.600" strokeDasharray="4 3" />
        <rect x="14" y="162" width="52" height="72" rx="8" fill="transparent" />
        <g className="room-body">
          <rect x="33" y="198" width="6" height="35" rx="2" fill="#c9aef2" />
          <path d="M20 190 Q20 172 36 172 Q52 172 52 190 V202 H20 Z" fill="#ffabd4" />
          <path d="M20 190 Q20 172 36 172 Q52 172 52 190" fill="none" stroke="#ff8fb1" strokeWidth="1.600" />
          <rect x="24" y="193" width="24" height="3" rx="1.500" fill="#e07aa4" opacity="0.55" />
          <path d="M36 190.500 c-3.500 -2.600 -4.800 -5.500 -2.600 -7 c1.500 -1 2.600 0 2.600 1 c0 -1 1.100 -2 2.600 -1 c2.200 1.500 .9 4.400 -2.600 7z" fill="#fffdf8" />
          <g transform="translate(52 196)">
            <g
              className={letterWaiting ? "room-flag" : undefined}
              transform={letterWaiting ? undefined : "rotate(82)"}
            >
              <rect x="-1.200" y="-17" width="2.400" height="17" fill="#e84f78" />
              <rect x="1.200" y="-17" width="10" height="7" rx="1.200" fill="#ff6b8b" />
            </g>
          </g>
          {letterWaiting && (
            <>
              <rect x="25" y="194" width="22" height="9" rx="1.500" fill="#fffdf8" />
              <path d="M25 194 L36 200 L47 194" fill="none" stroke="#e6dbf5" strokeWidth="1" />
              <path
                d="M36 160 c-3 -2.400 -4 -5 -2.200 -6.400 c1.400 -.9 2.200 0 2.200 .9 c0 -.9 .8 -1.800 2.200 -.9 c1.800 1.400 .8 4 -2.200 6.400z"
                fill="#ff8fb1"
                className="room-twinkle"
              />
            </>
          )}
        </g>
        <HotLabel x={40} y={156} text={letterWaiting ? "New letter" : "Mailbox"} />
      </g>

      {/* Rug */}
      <ellipse cx="200" cy="268" rx="114" ry="23" fill="#d6c3f2" />
      <ellipse cx="200" cy="268" rx="98" ry="18" fill="none" stroke="#ebe0fa" strokeWidth="2" />
      <ellipse cx="200" cy="268" rx="76" ry="13" fill="#e6d9f8" />

      {/* Calm corner → /calm */}
      <Link href="/calm" className="room-hot" aria-label="Calm corner — breathing and sounds">
        <rect className="room-ring" x="116" y="232" width="86" height="48" rx="10" fill="none" stroke="#7b5bc7" strokeWidth="1.600" strokeDasharray="4 3" />
        <rect x="116" y="232" width="86" height="48" rx="10" fill="transparent" />
        <g className="room-body">
          <ellipse cx="146" cy="268" rx="25" ry="9.500" fill="#ffabd4" />
          <ellipse cx="146" cy="264.500" rx="21" ry="7" fill="#ffc9df" />
          <circle cx="146" cy="264.500" r="2.200" fill="#ff8fb1" />
          <rect x="177" y="256" width="13" height="13" rx="3.500" fill="#fff3d6" stroke="#ead9b4" strokeWidth="1" />
          <path className="room-flicker" d="M183.500 255 q-2.800 -4 0 -8 q2.800 4 0 8z" fill="#ffcf5c" />
          <path className="room-flicker" d="M183.500 254.500 q-1.100 -2 0 -4.200 q1.100 2.200 0 4.200z" fill="#fffbe6" />
          <text x="130" y="248" fontSize="9" fill="#a08cc8" className="room-zzz">♪</text>
          <text x="160" y="244" fontSize="8" fill="#a08cc8" className="room-zzz" style={{ animationDelay: "2s" }}>♫</text>
        </g>
        <HotLabel x={160} y={228} text="Calm corner" />
      </Link>

      {/* The cat */}
      <g transform="translate(240 262)">
        <g className="room-breathe">
          <path d="M22 2 Q36 4 33 -8" stroke="#f2c9a0" strokeWidth="5.500" fill="none" strokeLinecap="round" />
          <ellipse cx="0" cy="0" rx="24" ry="10.500" fill="#f2c9a0" />
          <path d="M-6 -9 q2 5 0 9 M3 -10 q2 5 0 10 M12 -9 q2 5 0 9" stroke="#e2a977" strokeWidth="1.800" fill="none" strokeLinecap="round" />
          <circle cx="-21" cy="-3" r="9.500" fill="#f2c9a0" />
          <polygon points="-29,-9 -27,-19 -21,-12" fill="#f2c9a0" />
          <polygon points="-13,-9 -15,-19 -21,-12" fill="#f2c9a0" />
          <polygon points="-27.500,-11 -26.500,-16 -23.500,-12.500" fill="#ffb0c4" />
          <path d="M-26 -3 q2 2 4 0 M-19 -3 q2 2 4 0" stroke="#5b4b73" strokeWidth="1.300" fill="none" strokeLinecap="round" />
          <circle cx="-21" cy="0.500" r="1" fill="#ff8fb1" />
        </g>
        <text x="-34" y="-16" fontSize="8" fontStyle="italic" fill="#8e7bb8" className="room-zzz">z</text>
        <text x="-30" y="-20" fontSize="6.500" fontStyle="italic" fill="#8e7bb8" className="room-zzz" style={{ animationDelay: "1.6s" }}>z</text>
      </g>

      {/* Toy chest → Games */}
      <Link href="/games" className="room-hot" aria-label="Toy chest — all the games">
        <rect className="room-ring" x="280" y="226" width="68" height="52" rx="8" fill="none" stroke="#7b5bc7" strokeWidth="1.600" strokeDasharray="4 3" />
        <rect x="280" y="226" width="68" height="52" rx="8" fill="transparent" />
        <g className="room-body">
          <circle cx="300" cy="243" r="6.500" fill="#ff9fc0" />
          <rect x="311" y="236" width="10" height="10" rx="1.500" fill="#a6d8f4" transform="rotate(12 316 241)" />
          <polygon points="328,246 334,236 340,246" fill="#b8e8c6" />
          <rect x="288" y="250" width="52" height="26" rx="4" fill="#ffcfa4" stroke="#f0b17f" strokeWidth="1.200" />
          <rect x="288" y="259" width="52" height="4" fill="#f0b17f" />
          <rect x="311" y="256" width="6" height="8" rx="1.500" fill="#fffdf8" stroke="#f0b17f" strokeWidth="1" />
          <g transform="rotate(-13 288 250)">
            <path d="M286 250 L342 250 L339 241 Q314 233 289 241 Z" fill="#ffdcb8" stroke="#f0b17f" strokeWidth="1" />
          </g>
        </g>
        <HotLabel x={314} y={222} text="Games" />
      </Link>

      {/* Plant (grows with every game played) */}
      <Plant stage={plantStage} />

      {/* Dust motes in the light */}
      {skyTime !== "night" &&
        [
          [168, 190, 0],
          [196, 205, 2.200],
          [222, 196, 4.100],
          [150, 214, 5.300],
          [236, 214, 1.300],
        ].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r={1.300} fill="#fffbe6" className="room-mote" style={{ animationDelay: `${d}s` }} />
        ))}

      {/* Evening light: the room dims, the lamp and candles glow */}
      <rect width="400" height="300" fill="#1a1850" opacity={dim} pointerEvents="none" />
      {glow > 0 && (
        <g pointerEvents="none" style={{ mixBlendMode: "screen" }}>
          <circle cx="378" cy="146" r="64" fill={`url(#${uid}glow)`} opacity={glow} />
          <circle cx="364" cy="108" r="30" fill={`url(#${uid}glow)`} opacity={glow * 0.8} />
        </g>
      )}
      <g pointerEvents="none" style={{ mixBlendMode: "screen" }}>
        <circle cx="183" cy="252" r="42" fill={`url(#${uid}glow)`} opacity={0.25 + glow * 0.6} />
      </g>
    </svg>
  );
}
