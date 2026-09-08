const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+5:30

/** Today's date as seen in IST, so all "daily" resets flip at 12 AM IST. */
export function todayKey() {
  return new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10); // YYYY-MM-DD (IST)
}

/** The exact UTC instant of 12 AM IST today — for building precise time windows. */
export function startOfTodayIST(): Date {
  const istMidnightAsUTC = new Date(`${todayKey()}T00:00:00.000Z`).getTime();
  return new Date(istMidnightAsUTC - IST_OFFSET_MS);
}

export function isPastOrToday(dateKey: string) {
  return dateKey <= todayKey();
}

export function monthKeyOf(dateKey: string) {
  return dateKey.slice(0, 7); // YYYY-MM
}

const IST_TIME_ZONE = "Asia/Kolkata";

/** e.g. "Sep 7, 8:04 AM" — always in IST, regardless of server timezone. */
export function formatDateTimeIST(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIME_ZONE,
  }).format(date);
}

/** e.g. "Sep 7, 2026" — always in IST, regardless of server timezone. */
export function formatDateIST(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: IST_TIME_ZONE,
  }).format(date);
}
