import { describe, expect, it } from "vitest";
import {
  LOGIN_LOCK_MINUTES,
  LOGIN_MAX_FAILURES,
  afterFailedLogin,
  isLocked,
  minutesUntil,
} from "./throttle";

const NOW = new Date("2026-10-12T10:00:00Z");

describe("login lockout", () => {
  it("counts wrong passwords without locking until the limit", () => {
    let count = 0;
    for (let i = 1; i < LOGIN_MAX_FAILURES; i++) {
      const s = afterFailedLogin(count, NOW);
      expect(s.lockedUntil).toBeNull();
      expect(s.failedLoginCount).toBe(i);
      count = s.failedLoginCount;
    }
  });

  it("locks for 15 minutes on the fifth wrong password and resets the counter", () => {
    const s = afterFailedLogin(LOGIN_MAX_FAILURES - 1, NOW);
    expect(s.failedLoginCount).toBe(0);
    expect(s.lockedUntil!.getTime() - NOW.getTime()).toBe(LOGIN_LOCK_MINUTES * 60_000);
  });

  it("isLocked is true only while the lock is in the future", () => {
    expect(isLocked(null, NOW)).toBe(false);
    expect(isLocked(undefined, NOW)).toBe(false);
    expect(isLocked(new Date(NOW.getTime() + 1000), NOW)).toBe(true);
    expect(isLocked(new Date(NOW.getTime() - 1000), NOW)).toBe(false);
    expect(isLocked(new Date(NOW.getTime()), NOW)).toBe(false);
  });

  it("minutesUntil rounds up and is never below one", () => {
    expect(minutesUntil(new Date(NOW.getTime() + 61_000), NOW)).toBe(2);
    expect(minutesUntil(new Date(NOW.getTime() + 5_000), NOW)).toBe(1);
    expect(minutesUntil(new Date(NOW.getTime() - 5_000), NOW)).toBe(1);
  });
});
