"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { LinkButton } from "@/components/ui/Button";

const MOODS: { key: string; emoji: string }[] = [
  { key: "Happy", emoji: "😊" },
  { key: "Okay", emoji: "🙂" },
  { key: "Calm", emoji: "😌" },
  { key: "Neutral", emoji: "😐" },
  { key: "Low", emoji: "😔" },
  { key: "Upset", emoji: "😣" },
  { key: "Tired", emoji: "😴" },
  { key: "Unsure", emoji: "🤔" },
];

const LOW_MOODS = new Set(["Low", "Upset", "Tired", "Unsure"]);

export function MoodCheckIn({
  heading = "How are you feeling today?",
  subtext = "Totally optional — pick one if you'd like.",
  suggestGame = true,
  initialMood,
  onMoodChange,
}: {
  heading?: string;
  subtext?: string;
  /** Whether a low/hard mood should offer a link to Animal Runner. Turned
   * off where that would be circular — e.g. the re-check shown at the end
   * of Animal Runner itself. */
  suggestGame?: boolean;
  /** Today's mood when the page already knows it (null = known to be unset),
   * so the buttons are right on first paint and no fetch is needed. Leave
   * undefined to have the component look it up itself. */
  initialMood?: string | null;
  /** Called whenever the chosen mood changes — lets the room's window
   * follow along live. */
  onMoodChange?: (mood: string | null) => void;
} = {}) {
  const [mood, setMood] = useState<string | null>(initialMood ?? null);
  const [loading, setLoading] = useState(initialMood === undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialMood !== undefined) return;
    let ignore = false;
    fetch("/api/mood")
      .then((r) => r.json())
      .then((data) => {
        if (!ignore) setMood(data.mood ?? null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [initialMood]);

  async function pick(key: string) {
    const previous = mood;
    setMood(key);
    onMoodChange?.(key);
    setSaving(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: key }),
      });
      if (!res.ok) {
        setMood(previous);
        onMoodChange?.(previous);
      }
    } catch {
      setMood(previous);
      onMoodChange?.(previous);
    } finally {
      setSaving(false);
    }
  }

  const showSuggestion = suggestGame && !loading && !!mood && LOW_MOODS.has(mood);

  return (
    <div>
      <p className="font-heading text-sm font-semibold text-heading">{heading}</p>
      <p className="mt-0.5 text-xs text-muted">{subtext}</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={heading}>
        {MOODS.map((m) => {
          const selected = mood === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => pick(m.key)}
              disabled={loading || saving}
              aria-pressed={selected}
              className={cn(
                "pixel-pressable flex min-h-11 items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition disabled:opacity-60",
                selected
                  ? "border-purple bg-lavender text-lavender-text"
                  : "border-transparent bg-white/70 text-heading hover:border-lavender-strong",
              )}
            >
              <span aria-hidden>{m.emoji}</span>
              {m.key}
            </button>
          );
        })}
      </div>
      {mood && (
        <p className="mt-3 text-xs text-muted">Thanks for sharing that. ♡</p>
      )}
      {showSuggestion && (
        <div className="mt-3 rounded-xl bg-lavender/50 p-3">
          <p className="text-sm text-heading">
            Want a gentle place to land? Animal Runner might help. <span aria-hidden>♡</span>
          </p>
          <LinkButton
            href="/games/animal-runner"
            variant="lavender"
            className="mt-2 px-4 py-2 text-xs"
          >
            Play Animal Runner
          </LinkButton>
        </div>
      )}
    </div>
  );
}
