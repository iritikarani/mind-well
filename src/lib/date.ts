const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Today's date (YYYY-MM-DD) as seen in the given IANA timezone. */
export function todayKeyInZone(timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

function offsetMinutesAt(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const offsetPart = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
  const match = offsetPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);
  return sign * (hours * 60 + minutes);
}

/** The exact UTC instant of 12 AM today in the given timezone — for precise time windows. */
export function startOfDayInZone(timeZone: string): Date {
  const dateKey = todayKeyInZone(timeZone);
  const utcGuessMs = new Date(`${dateKey}T00:00:00.000Z`).getTime();
  const offsetMin = offsetMinutesAt(new Date(utcGuessMs), timeZone);
  return new Date(utcGuessMs - offsetMin * 60 * 1000);
}

/**
 * A pure calendar-date day count: the same number for the same "YYYY-MM-DD"
 * everywhere, regardless of timezone. Used for content that should be
 * identical for everyone on the same calendar date (e.g. the World Puzzle's
 * puzzle of the day) — two users in different timezones both on "Sep 8"
 * locally get the same index, even though that's a different real-world
 * moment for each of them.
 */
export function dayIndexOf(dateKey: string): number {
  return Math.floor(new Date(`${dateKey}T00:00:00.000Z`).getTime() / MS_PER_DAY);
}

export function isPastOrToday(dateKey: string, timeZone: string) {
  return dateKey <= todayKeyInZone(timeZone);
}

export function monthKeyOf(dateKey: string) {
  return dateKey.slice(0, 7); // YYYY-MM
}

/** e.g. "Sep 7, 8:04 AM" — in the given timezone. */
export function formatDateTimeInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(date);
}

/** e.g. "Sep 7, 2026" — in the given timezone. */
export function formatDateInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(date);
}
