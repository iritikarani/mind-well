"use client";

import { useSyncExternalStore } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function subscribeClock(cb: () => void) {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
}

function clockSnapshot() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}|${d.getHours()}`;
}

/** The viewer's own local date and hour (the server can't know them), or
 * null while rendering on the server. A string snapshot keeps React from
 * re-rendering on every tick — it only changes when the hour or date does. */
export function useRoomClock(): { dateKey: string; hour: number } | null {
  const snap = useSyncExternalStore(subscribeClock, clockSnapshot, () => "");
  if (!snap) return null;
  const [dateKey, hour] = snap.split("|");
  return { dateKey, hour: Number(hour) };
}

const SEEN_KEY = "hs-letter-seen";
const SEEN_EVENT = "hs-letter-seen";

function subscribeSeen(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(SEEN_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(SEEN_EVENT, cb);
  };
}

function seenSnapshot(): string {
  try {
    return localStorage.getItem(SEEN_KEY) ?? "";
  } catch {
    return "";
  }
}

/** The date key of the last letter this device opened ("" if none), or
 * null on the server. */
export function useLetterSeenDate(): string | null {
  return useSyncExternalStore(subscribeSeen, seenSnapshot, () => null);
}

export function markLetterSeen(dateKey: string) {
  try {
    localStorage.setItem(SEEN_KEY, dateKey);
  } catch {
    // storage unavailable (private mode) — the flag just stays up
  }
  window.dispatchEvent(new Event(SEEN_EVENT));
}
