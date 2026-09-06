import type { MonumentDef } from "@/lib/worldPuzzleContent";

export const ART_SIZE = 300;

function Structure({ def }: { def: MonumentDef }) {
  const { primary: p, accent: a, archetype } = def;

  switch (archetype) {
    case "tower":
      return (
        <g>
          <polygon points="110,230 190,230 165,120 135,120" fill={p} />
          <polygon points="135,120 165,120 152,55 148,55" fill={p} />
          <rect x={128} y={150} width={44} height={8} fill={a} />
          <rect x={138} y={95} width={24} height={6} fill={a} />
          <circle cx={150} cy={45} r={5} fill={a} />
        </g>
      );

    case "pyramid":
      return (
        <g>
          <polygon points="70,230 130,140 190,230" fill={a} opacity={0.6} />
          <polygon points="110,230 170,110 230,230" fill={p} />
          <polygon points="170,110 230,230 200,230" fill={a} opacity={0.5} />
        </g>
      );

    case "dome":
      return (
        <g>
          <rect x={95} y={175} width={110} height={55} fill={p} />
          <path d="M 100 175 A 50 50 0 0 1 200 175 Z" fill={p} />
          <circle cx={150} cy={155} r={7} fill={a} />
          <rect x={70} y={140} width={10} height={90} fill={p} />
          <polygon points="65,140 85,140 75,120" fill={p} />
          <rect x={220} y={140} width={10} height={90} fill={p} />
          <polygon points="215,140 235,140 225,120" fill={p} />
          <rect x={135} y={200} width={30} height={30} fill={a} opacity={0.7} />
        </g>
      );

    case "arch":
      return (
        <g>
          <path
            d="M 105 230 L 105 150 A 45 45 0 0 1 195 150 L 195 230 L 175 230 L 175 155 A 25 25 0 0 0 125 155 L 125 230 Z"
            fill={p}
          />
          <rect x={100} y={220} width={100} height={10} fill={a} opacity={0.6} />
        </g>
      );

    case "statue":
      return (
        <g>
          <rect x={110} y={205} width={80} height={25} fill={a} />
          <rect x={125} y={175} width={50} height={35} fill={a} opacity={0.8} />
          <polygon points="135,175 165,175 155,90 145,90" fill={p} />
          <circle cx={150} cy={80} r={13} fill={p} />
          <rect x={158} y={70} width={8} height={35} fill={p} />
          <polygon points="158,55 174,55 166,40" fill={a} />
        </g>
      );

    case "colosseum":
      return (
        <g>
          <ellipse cx={150} cy={200} rx={95} ry={45} fill="none" stroke={p} strokeWidth={26} />
          {Array.from({ length: 9 }).map((_, i) => {
            const t = (i / 8) * Math.PI;
            const x = 150 - Math.cos(t) * 95;
            const y = 200 - Math.sin(t) * 45;
            return <rect key={i} x={x - 4} y={y - 10} width={8} height={20} fill={a} opacity={0.7} />;
          })}
        </g>
      );

    case "skyscraper":
      return (
        <g>
          <rect x={118} y={90} width={64} height={140} fill={p} />
          <rect x={130} y={65} width={40} height={25} fill={p} />
          <rect x={142} y={40} width={16} height={25} fill={a} />
          <rect x={148} y={25} width={4} height={16} fill={a} />
          {[110, 130, 150, 170].map((y) => (
            <rect key={y} x={124} y={y} width={52} height={4} fill={a} opacity={0.5} />
          ))}
        </g>
      );

    case "temple":
      return (
        <g>
          <polygon points="90,230 210,230 190,195 110,195" fill={p} />
          <polygon points="105,195 195,195 178,165 122,165" fill={a} opacity={0.85} />
          <polygon points="118,165 182,165 168,138 132,138" fill={p} />
          <polygon points="132,138 168,138 158,110 142,110" fill={a} opacity={0.85} />
          <rect x={146} y={90} width={8} height={22} fill={p} />
          <circle cx={150} cy={85} r={5} fill={a} />
        </g>
      );

    case "bridge":
      return (
        <g>
          <rect x={85} y={110} width={10} height={120} fill={p} />
          <rect x={205} y={110} width={10} height={120} fill={p} />
          <path d="M 60 190 Q 150 110 240 190" fill="none" stroke={a} strokeWidth={5} />
          <path d="M 90 115 L 90 195 M 210 115 L 210 195" stroke={a} strokeWidth={3} />
          <rect x={60} y={195} width={180} height={10} fill={p} />
          {[100, 130, 170, 200].map((x) => (
            <line key={x} x1={x} y1={195} x2={x} y2={150} stroke={a} strokeWidth={2} opacity={0.6} />
          ))}
        </g>
      );

    case "castle":
      return (
        <g>
          <rect x={95} y={175} width={110} height={55} fill={p} />
          <rect x={85} y={130} width={26} height={100} fill={p} />
          <rect x={189} y={130} width={26} height={100} fill={p} />
          <rect x={135} y={110} width={30} height={120} fill={p} />
          {[85, 189, 135].map((x, i) => (
            <polygon key={i} points={`${x},130 ${x + (i === 2 ? 30 : 26)},130 ${x + (i === 2 ? 15 : 13)},110`} fill={a} />
          ))}
          <rect x={144} y={150} width={12} height={20} fill={a} opacity={0.7} />
        </g>
      );

    case "clocktower":
      return (
        <g>
          <rect x={128} y={70} width={44} height={160} fill={p} />
          <circle cx={150} cy={100} r={20} fill="#FFFDFB" stroke={a} strokeWidth={4} />
          <line x1={150} y1={100} x2={150} y2={88} stroke={a} strokeWidth={2} />
          <line x1={150} y1={100} x2={159} y2={104} stroke={a} strokeWidth={2} />
          <polygon points="122,70 178,70 150,40" fill={a} />
        </g>
      );

    case "rock":
      return (
        <g>
          <polygon points="60,230 95,150 130,190 150,120 180,195 210,155 240,230" fill={p} />
          <polygon points="95,230 130,190 150,230" fill={a} opacity={0.5} />
          <polygon points="180,230 210,180 235,230" fill={a} opacity={0.5} />
        </g>
      );

    case "mountain":
      return (
        <g>
          <polygon points="60,230 150,90 240,230" fill={p} />
          <polygon points="130,140 150,90 170,140 158,130 142,130" fill="#FFFFFF" opacity={0.85} />
          <polygon points="150,90 195,230 240,230 175,120" fill={a} opacity={0.35} />
        </g>
      );

    case "shell":
      return (
        <g>
          <rect x={70} y={210} width={160} height={20} fill={p} opacity={0.5} />
          <path d="M 90 210 Q 95 130 130 105 Q 140 160 120 210 Z" fill={p} />
          <path d="M 130 210 Q 138 115 175 90 Q 182 155 158 210 Z" fill={p} />
          <path d="M 170 210 Q 180 135 210 118 Q 216 165 198 210 Z" fill={a} opacity={0.85} />
        </g>
      );

    case "wall":
      return (
        <g>
          <polyline
            points="40,230 40,205 75,205 75,180 110,180 110,205 150,205 150,170 190,170 190,205 225,205 225,180 260,180 260,230"
            fill="none"
            stroke={p}
            strokeWidth={18}
            strokeLinejoin="round"
          />
          <rect x={130} y={130} width={40} height={45} fill={a} />
          <polygon points="125,130 175,130 150,110" fill={a} />
        </g>
      );

    default:
      return null;
  }
}

export function MonumentArt({ def, size = ART_SIZE }: { def: MonumentDef; size?: number }) {
  return (
    <svg viewBox="0 0 300 300" width={size} height={size}>
      <rect x={0} y={0} width={300} height={300} fill={def.sky} />
      <circle cx={248} cy={54} r={22} fill="#FFF3D6" opacity={0.9} />
      <ellipse cx={230} cy={230} rx={260} ry={70} fill="#FFFFFF" opacity={0.25} />
      <Structure def={def} />
      <rect x={0} y={230} width={300} height={70} fill="#EFE6D8" opacity={0.9} />
    </svg>
  );
}
