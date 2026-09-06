import { cn } from "@/lib/cn";
import { ANIMALS, type AnimalKey } from "./animals";

export type Pose = "idle" | "jump" | "duck" | "win" | "low";

function Ears({ ears, primary, accent }: { ears: string; primary: string; accent: string }) {
  switch (ears) {
    case "pointy":
      return (
        <>
          <polygon points="28,20 20,-2 40,14" fill={primary} />
          <polygon points="72,20 80,-2 60,14" fill={primary} />
          <polygon points="30,18 26,4 38,14" fill={accent} opacity={0.7} />
          <polygon points="70,18 74,4 62,14" fill={accent} opacity={0.7} />
        </>
      );
    case "tallPointy":
      return (
        <>
          <polygon points="30,18 24,-8 42,12" fill={primary} />
          <polygon points="70,18 76,-8 58,12" fill={primary} />
        </>
      );
    case "round":
      return (
        <>
          <circle cx="26" cy="8" r="14" fill={primary} />
          <circle cx="74" cy="8" r="14" fill={primary} />
        </>
      );
    case "floppy":
      return (
        <>
          <ellipse cx="24" cy="22" rx="11" ry="20" fill={primary} transform="rotate(-15 24 22)" />
          <ellipse cx="76" cy="22" rx="11" ry="20" fill={primary} transform="rotate(15 76 22)" />
        </>
      );
    case "long":
      return (
        <>
          <ellipse cx="34" cy="-10" rx="9" ry="26" fill={primary} transform="rotate(-8 34 -10)" />
          <ellipse cx="66" cy="-10" rx="9" ry="26" fill={primary} transform="rotate(8 66 -10)" />
          <ellipse cx="34" cy="-8" rx="4" ry="18" fill={accent} opacity={0.7} transform="rotate(-8 34 -8)" />
          <ellipse cx="66" cy="-8" rx="4" ry="18" fill={accent} opacity={0.7} transform="rotate(8 66 -8)" />
        </>
      );
    case "antler":
      return (
        <>
          <circle cx="30" cy="10" r="7" fill={primary} />
          <circle cx="70" cy="10" r="7" fill={primary} />
          <path d="M30 4 L26 -10 M30 4 L34 -8" stroke={primary} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 4 L74 -10 M70 4 L66 -8" stroke={primary} strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      );
    default:
      return null;
  }
}

const poseTransform: Record<Pose, string> = {
  idle: "",
  jump: "",
  duck: "scaleY(0.7) translateY(14px)",
  win: "",
  low: "",
};

const poseAnimation: Record<Pose, string> = {
  idle: "animate-[runner-bounce_0.6s_ease-in-out_infinite]",
  jump: "animate-[runner-jump_0.5s_ease-out]",
  duck: "",
  win: "animate-[runner-win_0.7s_ease-in-out_infinite]",
  low: "animate-[runner-low_1.4s_ease-in-out_infinite] opacity-70",
};

export function AnimalAvatar({
  animal,
  pose = "idle",
  size = 96,
  className,
}: {
  animal: AnimalKey;
  pose?: Pose;
  size?: number;
  className?: string;
}) {
  const def = ANIMALS.find((a) => a.key === animal) ?? ANIMALS[0];

  return (
    <div
      className={cn(poseAnimation[pose], className)}
      style={{ width: size, height: size, transform: poseTransform[pose] }}
    >
      <svg viewBox="-10 -30 120 130" width={size} height={size}>
        <Ears ears={def.ears} primary={def.primary} accent={def.accent} />

        {/* body */}
        <ellipse cx="50" cy="78" rx="26" ry="20" fill={def.primary} />
        {/* head */}
        <circle cx="50" cy="34" r="30" fill={def.primary} />

        {/* face accent patch (muzzle) */}
        <ellipse cx="50" cy="42" rx="16" ry="12" fill={def.accent} opacity={0.85} />

        {/* eyes */}
        {pose === "low" ? (
          <>
            <path d="M36 30 q6 4 12 0" stroke="#3B2E38" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M52 30 q6 4 12 0" stroke="#3B2E38" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="41" cy="32" rx="4" ry={pose === "win" ? 2 : 5} fill="#3B2E38" />
            <ellipse cx="59" cy="32" rx="4" ry={pose === "win" ? 2 : 5} fill="#3B2E38" />
          </>
        )}

        {/* nose */}
        <ellipse cx="50" cy="40" rx="3.5" ry="2.5" fill="#3B2E38" />

        {/* cheeks */}
        <circle cx="30" cy="42" r="5" fill="#FFC7DD" opacity={0.6} />
        <circle cx="70" cy="42" r="5" fill="#FFC7DD" opacity={0.6} />

        {/* legs */}
        <ellipse cx="38" cy="98" rx="7" ry="9" fill={def.primary} />
        <ellipse cx="62" cy="98" rx="7" ry="9" fill={def.primary} />
      </svg>
    </div>
  );
}

export { ANIMALS };
