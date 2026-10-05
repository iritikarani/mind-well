"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { MonumentDef } from "@/lib/worldPuzzleContent";
import { SharePostcardButton } from "./SharePostcardButton";

/** The flip-card itself plus its flip/share controls — shared between the
 * live "just solved it" reveal and the read-only "already played today"
 * view, so both show the exact same postcard. */
export function PostcardReveal({
  monument,
  quote,
  note,
  userName,
}: {
  monument: MonumentDef;
  quote: string;
  note: string;
  userName: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <div className="postcard-scene mx-auto h-[300px] w-full max-w-[280px] sm:h-[340px] sm:max-w-[320px]">
        <div className={cn("postcard-flipper relative h-full w-full", flipped && "is-flipped")}>
          <div className="postcard-face absolute inset-0 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={monument.image} alt={monument.name} className="h-full w-full object-cover" />
          </div>
          <div className="postcard-face postcard-face-back flex flex-col items-center justify-center rounded-2xl bg-lavender p-5 text-center">
            <h2 className="font-heading text-xl font-bold text-heading">{monument.name}</h2>
            <p className="text-sm text-muted">{monument.country}</p>
            <p className="mt-3 text-sm text-heading">{note}</p>
            <p className="mt-3 text-xs italic text-purple-text">{quote}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={() => setFlipped((v) => !v)}>
          {flipped ? "Flip back" : "Flip postcard"}
        </Button>
        <SharePostcardButton
          imageUrl={monument.image}
          name={monument.name}
          country={monument.country}
          note={note}
          quote={quote}
          userName={userName}
        />
      </div>
    </>
  );
}
