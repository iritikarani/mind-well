"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pickLetter } from "@/lib/letters";
import { buildReminderIcs } from "@/lib/reminder";
import { cn } from "@/lib/cn";
import { markLetterSeen } from "@/components/space/useRoomClock";

const REMINDER_TIMES = [
  { label: "9:00 am", hour: 9 },
  { label: "1:00 pm", hour: 13 },
  { label: "6:00 pm", hour: 18 },
  { label: "9:00 pm", hour: 21 },
];

export function DailyLetter({
  open,
  onClose,
  name,
  mood,
  dateKey,
  seed,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  mood: string | null;
  dateKey: string;
  seed: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [hour, setHour] = useState(21);
  const [added, setAdded] = useState(false);
  const letter = pickLetter(dateKey, mood, seed);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      markLetterSeen(dateKey);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, dateKey]);

  function downloadReminder() {
    const ics = buildReminderIcs({ hour, url: window.location.origin });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "happy-space-daily-letter.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setAdded(true);
  }

  const firstName = name.split(" ")[0];
  const prettyDate = new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="letter-title"
      className="m-auto w-[min(92vw,26rem)] max-h-[92dvh] overflow-y-auto rounded-3xl border-0 bg-transparent p-0 backdrop:bg-[#2b1f4a]/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative rounded-3xl bg-surface p-6 shadow-[0_20px_60px_rgba(43,31,74,0.35)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close letter"
          className="absolute right-3 top-3 flex min-h-11 min-w-11 items-center justify-center rounded-full text-heading hover:bg-lavender/50"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{prettyDate}</p>
        <h2 id="letter-title" className="mt-1 font-heading text-2xl font-bold text-heading">
          Dear {firstName},
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-heading">{letter.body}</p>

        <div className="mt-4 rounded-2xl bg-mint px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-mint-text">A tiny thing to try</p>
          <p className="mt-1 text-sm text-heading">{letter.tryThis}</p>
        </div>

        <p className="mt-4 font-heading text-sm font-semibold text-purple-text">
          With love, your Happy Space <span aria-hidden>♡</span>
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/calm"
            className="pixel-panel pixel-pressable inline-flex min-h-11 items-center rounded-2xl bg-lavender-strong px-4 py-2 font-heading text-sm font-semibold text-lavender-text hover:brightness-105"
          >
            Breathe with me →
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center rounded-2xl px-4 py-2 font-heading text-sm font-semibold text-heading hover:bg-lavender/40"
          >
            Back to my room
          </button>
        </div>

        <div className="mt-5 border-t border-lavender/70 pt-4">
          <p className="font-heading text-sm font-semibold text-heading">Want a daily nudge?</p>
          <p className="mt-0.5 text-xs text-muted">
            Add a small repeating reminder to your own calendar — no notifications to allow, nothing to sign up for.
          </p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Reminder time">
            {REMINDER_TIMES.map((t) => (
              <button
                key={t.hour}
                type="button"
                onClick={() => {
                  setHour(t.hour);
                  setAdded(false);
                }}
                aria-pressed={hour === t.hour}
                className={cn(
                  "min-h-11 rounded-full border-2 px-3.5 text-sm font-semibold",
                  hour === t.hour
                    ? "border-purple bg-lavender text-lavender-text"
                    : "border-transparent bg-white/70 text-heading hover:border-lavender-strong",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={downloadReminder}
            className="mt-3 inline-flex min-h-11 items-center rounded-2xl bg-blush px-4 py-2 font-heading text-sm font-semibold text-blush-text hover:brightness-105"
          >
            Add to my calendar
          </button>
          {added && (
            <p role="status" className="mt-2 text-xs text-muted">
              Done — open the file and your calendar will add it. ♡
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
