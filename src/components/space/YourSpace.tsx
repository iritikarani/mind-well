"use client";

import Link from "next/link";
import { useState } from "react";
import { RoomScene, type RoomPostcard } from "@/components/space/RoomScene";
import { DailyLetter } from "@/components/space/DailyLetter";
import { useLetterSeenDate, useRoomClock } from "@/components/space/useRoomClock";
import { MoodCheckIn } from "@/components/app/MoodCheckIn";
import { Card } from "@/components/ui/Card";
import {
  greetingFor,
  plantStage,
  timeOfDayFromHour,
  weatherLine,
} from "@/lib/room";

interface YourSpaceProps {
  name: string;
  userSeed: string;
  initialMood: string | null;
  postcards: RoomPostcard[];
  postcardTotal: number;
  badgeCount: number;
  totalPlays: number;
  journalToday: boolean;
}

export function YourSpace({
  name,
  userSeed,
  initialMood,
  postcards,
  postcardTotal,
  badgeCount,
  totalPlays,
  journalToday,
}: YourSpaceProps) {
  const clock = useRoomClock();
  const seenDate = useLetterSeenDate();
  const [mood, setMood] = useState<string | null>(initialMood);
  const [letterOpen, setLetterOpen] = useState(false);

  const firstName = name.split(" ")[0];
  const letterWaiting = !!clock && seenDate !== null && seenDate !== clock.dateKey;

  return (
    <section aria-labelledby="space-heading">
      <div className="px-1">
        <h1 id="space-heading" className="font-heading text-3xl font-bold text-heading">
          {clock ? greetingFor(clock.hour) : "Hello"}, {firstName} <span aria-hidden>♡</span>
        </h1>
        <p className="mt-1 text-sm text-muted" aria-live="polite">
          {weatherLine(mood)}
        </p>
      </div>

      <div className="pixel-panel mt-4 overflow-hidden rounded-[28px] bg-surface shadow-[0_8px_30px_rgba(91,71,137,0.14)]">
        {clock ? (
          <RoomScene
            mood={mood}
            timeOfDay={timeOfDayFromHour(clock.hour)}
            postcards={postcards}
            badgeCount={badgeCount}
            plantStage={plantStage(totalPlays)}
            journalToday={journalToday}
            letterWaiting={letterWaiting}
            onMailbox={() => setLetterOpen(true)}
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-b from-lavender/70 to-butter-soft">
            <span aria-hidden className="animate-breathe text-4xl">
              🏠
            </span>
            <span className="sr-only">Loading your room…</span>
          </div>
        )}
      </div>

      <nav aria-label="Around your room" className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLetterOpen(true)}
          className="pixel-pressable relative flex min-h-11 items-center gap-1.5 rounded-full bg-blush px-4 py-2 text-sm font-semibold text-blush-text hover:brightness-105"
        >
          <span aria-hidden>💌</span> {letterWaiting ? "A letter is waiting" : "Today's letter"}
          {letterWaiting && (
            <span aria-hidden className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
        <RoomLink href="/calm" emoji="🕯️" label="Calm corner" />
        <RoomLink href="/games/world-puzzle/my-world" emoji="🗺️" label={`Postcards · ${postcardTotal}`} />
        <RoomLink href="/badges" emoji="🏅" label={`Badges · ${badgeCount}`} />
        <RoomLink href="/games/three-things" emoji="📖" label="Journal" />
        <RoomLink href="/games" emoji="🧸" label="Games" />
      </nav>

      <Card className="mt-4">
        <MoodCheckIn initialMood={initialMood} onMoodChange={setMood} />
      </Card>

      {clock && (
        <DailyLetter
          open={letterOpen}
          onClose={() => setLetterOpen(false)}
          name={name}
          mood={mood}
          dateKey={clock.dateKey}
          seed={userSeed}
        />
      )}
    </section>
  );
}

function RoomLink({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link
      href={href}
      className="pixel-pressable flex min-h-11 items-center gap-1.5 rounded-full bg-lavender px-4 py-2 text-sm font-semibold text-lavender-text hover:bg-lavender-strong"
    >
      <span aria-hidden>{emoji}</span> {label}
    </Link>
  );
}
