const CRLF = "\r\n";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function icsLocal(d: Date, hour: number, minute: number) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hour)}${pad(minute)}00`;
}

function icsUtc(d: Date) {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** A calendar file with one daily-repeating "your letter is waiting" event.
 * Uses floating local time (no time zone) so it fires at the same hour on
 * the person's wall clock wherever they are — and needs no server, push
 * keys or accounts: their own calendar app does the reminding. */
export function buildReminderIcs(opts: { hour: number; minute?: number; url: string; now?: Date }): string {
  const now = opts.now ?? new Date();
  const minute = opts.minute ?? 0;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const host = (() => {
    try {
      return new URL(opts.url).host;
    } catch {
      return "happy-space";
    }
  })();

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Happy Space//Daily letter//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:daily-letter@${host}`,
    `DTSTAMP:${icsUtc(now)}`,
    `DTSTART:${icsLocal(start, opts.hour, minute)}`,
    "RRULE:FREQ=DAILY",
    "SUMMARY:A letter is waiting in Happy Space",
    `DESCRIPTION:Take a minute for yourself. ${opts.url}`,
    `URL:${opts.url}`,
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:A letter is waiting in Happy Space",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join(CRLF);
}
