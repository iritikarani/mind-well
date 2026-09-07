export function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
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
