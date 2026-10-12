export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

export interface Weather {
  rain: boolean;
  mist: boolean;
  /** How many clouds drift past the window (0–3). */
  clouds: 0 | 1 | 2 | 3;
  sparkles: boolean;
  birds: boolean;
}

export type PlantStage = 0 | 1 | 2 | 3 | 4;

export function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

/** The window mirrors how the person said they feel: a hard feeling gets a
 * cozy rain, a bright one gets sun and birds. Never anything alarming. */
export function weatherForMood(mood: string | null): Weather {
  switch (mood) {
    case "Happy":
      return { rain: false, mist: false, clouds: 1, sparkles: true, birds: true };
    case "Calm":
      return { rain: false, mist: false, clouds: 1, sparkles: false, birds: false };
    case "Okay":
    case "Neutral":
      return { rain: false, mist: false, clouds: 2, sparkles: false, birds: false };
    case "Low":
    case "Upset":
      return { rain: true, mist: false, clouds: 3, sparkles: false, birds: false };
    case "Tired":
      return { rain: false, mist: false, clouds: 1, sparkles: false, birds: false };
    case "Unsure":
      return { rain: false, mist: true, clouds: 2, sparkles: false, birds: false };
    default:
      return { rain: false, mist: false, clouds: 1, sparkles: false, birds: false };
  }
}

/** Feeling tired brings the evening light early — rest is allowed. */
export function skyTimeFor(tod: TimeOfDay, mood: string | null): TimeOfDay {
  if (mood === "Tired" && (tod === "day" || tod === "dawn")) return "dusk";
  return tod;
}

const PLANT_THRESHOLDS = [0, 1, 6, 16, 31] as const;

/** The plant grows a little with every game played — never shrinks. */
export function plantStage(totalPlays: number): PlantStage {
  let stage: PlantStage = 0;
  PLANT_THRESHOLDS.forEach((min, i) => {
    if (totalPlays >= min) stage = i as PlantStage;
  });
  return stage;
}

export function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Hello, night owl";
}

export function weatherLine(mood: string | null): string {
  switch (mood) {
    case "Happy":
      return "Sunshine is pouring in. Enjoy every bit of it.";
    case "Calm":
      return "A soft, easy sky — just like you today.";
    case "Okay":
      return "A mild, steady day. Those count too.";
    case "Neutral":
      return "Overcast and quiet. Nothing needs figuring out right now.";
    case "Low":
      return "It's raining a little in here. That's okay — the room is warm, and you can stay as long as you like.";
    case "Upset":
      return "A grey sky for a hard feeling. You don't have to fix anything — just sit in the dry for a while.";
    case "Tired":
      return "The evening light came early today. Rest is allowed.";
    case "Unsure":
      return "A little mist in the air. Not knowing is okay, too.";
    default:
      return "How's the weather inside today? Tell the room and the window will match.";
  }
}

export const SKY: Record<TimeOfDay, { top: string; bottom: string; hill: string; hillFar: string }> = {
  dawn: { top: "#ffcdb8", bottom: "#f4e3ff", hill: "#c9b6e8", hillFar: "#ddd0f2" },
  day: { top: "#9fd6f7", bottom: "#e6f6ff", hill: "#a6dcb4", hillFar: "#c4ebcd" },
  dusk: { top: "#7d68c4", bottom: "#ffb48a", hill: "#6d5fa8", hillFar: "#8f7cc4" },
  night: { top: "#1f2358", bottom: "#4a3f8f", hill: "#2f2b6b", hillFar: "#3d3880" },
};

/** How dark the room itself gets (0 = full daylight). */
export function roomDim(tod: TimeOfDay, weather: Weather): number {
  const base = { dawn: 0.05, day: 0, dusk: 0.14, night: 0.34 }[tod];
  return Math.min(0.5, base + (weather.rain ? 0.06 : 0));
}

/** How strongly the lamp and candle glow (0–1): they come on as it darkens. */
export function lampGlow(tod: TimeOfDay): number {
  return { dawn: 0.1, day: 0, dusk: 0.45, night: 1 }[tod];
}
