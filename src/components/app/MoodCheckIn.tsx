"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

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

export function MoodCheckIn() {
  const [mood, setMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
  }, []);

  async function pick(key: string) {
    const previous = mood;
    setMood(key);
    setSaving(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: key }),
      });
      if (!res.ok) setMood(previous);
    } catch {
      setMood(previous);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <p className="font-heading text-sm font-semibold text-heading">How are you feeling today?</p>
      <p className="mt-0.5 text-xs text-muted">Totally optional — pick one if you&apos;d like.</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="How are you feeling today?">
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
    </div>
  );
}
