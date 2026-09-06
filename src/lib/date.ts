export function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export function isPastOrToday(dateKey: string) {
  return dateKey <= todayKey();
}

export function monthKeyOf(dateKey: string) {
  return dateKey.slice(0, 7); // YYYY-MM
}
