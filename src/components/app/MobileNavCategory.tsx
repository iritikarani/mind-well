"use client";

import Link from "next/link";
import { useState } from "react";
import { GAMES } from "@/lib/games";
import { cn } from "@/lib/cn";

/** An expandable category row for the mobile nav menu — tapping it reveals
 * the actual games in that category, and tapping a game navigates straight
 * to it (instead of just scrolling to an anchor on the games/home page). */
export function MobileNavCategory({
  label,
  onNavigate,
}: {
  label: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const games = GAMES.filter((g) => g.category === label);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-heading hover:bg-lavender/40"
      >
        {label}
        <span aria-hidden className={cn("transition-transform", open && "rotate-180")}>
          ⌄
        </span>
      </button>
      {open && (
        <div className="ml-3 flex flex-col gap-0.5 border-l-2 border-lavender/60 pl-3">
          {games.map((g) => (
            <Link
              key={g.key}
              href={g.href}
              onClick={onNavigate}
              className="flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm text-heading hover:bg-lavender/40"
            >
              <span aria-hidden>{g.emoji}</span>
              {g.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
