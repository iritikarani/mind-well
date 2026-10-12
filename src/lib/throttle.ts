export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_LOCK_MINUTES = 15;
export const OTP_SENDS_PER_HOUR = 5;

const MINUTE_MS = 60 * 1000;

export function isLocked(lockedUntil: Date | null | undefined, now = new Date()): boolean {
  return !!lockedUntil && lockedUntil.getTime() > now.getTime();
}

export function minutesUntil(date: Date, now = new Date()): number {
  return Math.max(1, Math.ceil((date.getTime() - now.getTime()) / MINUTE_MS));
}

/** What to store after one more wrong password: either just a bumped
 * counter, or — on reaching the limit — a fresh lock and a reset counter. */
export function afterFailedLogin(
  failedLoginCount: number,
  now = new Date(),
): { failedLoginCount: number; lockedUntil: Date | null } {
  const next = failedLoginCount + 1;
  if (next >= LOGIN_MAX_FAILURES) {
    return { failedLoginCount: 0, lockedUntil: new Date(now.getTime() + LOGIN_LOCK_MINUTES * MINUTE_MS) };
  }
  return { failedLoginCount: next, lockedUntil: null };
}

export class OtpRateLimitError extends Error {
  constructor() {
    super("Too many verification codes requested");
    this.name = "OtpRateLimitError";
  }
}
