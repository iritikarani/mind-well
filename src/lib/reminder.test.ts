import { describe, expect, it } from "vitest";
import { buildReminderIcs } from "./reminder";

const NOW = new Date(2026, 9, 12, 15, 30, 0); // local: 12 Oct 2026, 3:30pm

describe("buildReminderIcs", () => {
  const ics = buildReminderIcs({ hour: 21, url: "https://example.com", now: NOW });

  it("is a well-formed calendar with CRLF line endings", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
  });

  it("repeats daily, starting tomorrow at the chosen local hour (floating time)", () => {
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics).toContain("DTSTART:20261013T210000");
    expect(ics).not.toMatch(/DTSTART[^\r\n]*Z/);
  });

  it("includes the link and an alarm", () => {
    expect(ics).toContain("URL:https://example.com");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("UID:daily-letter@example.com");
  });

  it("rolls over month ends correctly", () => {
    const eom = buildReminderIcs({ hour: 9, url: "https://x.y", now: new Date(2026, 9, 31, 10) });
    expect(eom).toContain("DTSTART:20261101T090000");
  });
});
