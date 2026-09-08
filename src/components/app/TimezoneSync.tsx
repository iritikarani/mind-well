"use client";

import { useEffect } from "react";

/** Detects the visitor's IANA timezone and stores it in a cookie so server
 *  components/routes can compute "today" and daily resets in the user's own
 *  local time instead of a fixed server timezone. */
export function TimezoneSync() {
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        document.cookie = `tz=${encodeURIComponent(tz)}; path=/; max-age=31536000; samesite=lax`;
      }
    } catch {
      // Intl unsupported or blocked — server falls back to a default timezone.
    }
  }, []);

  return null;
}
