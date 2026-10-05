"use client";

import { useState } from "react";
import { shareOrDownloadPostcard } from "@/lib/postcardShareImage";

export function SharePostcardButton({
  imageUrl,
  name,
  country,
  note,
  quote,
  userName,
}: {
  imageUrl: string;
  name: string;
  country: string;
  note: string;
  quote: string;
  userName: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      const dateLabel = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      await shareOrDownloadPostcard({ imageUrl, name, country, note, quote, userName, dateLabel });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="min-h-11 rounded-full bg-lavender px-4 py-2 text-sm font-semibold text-lavender-text hover:bg-lavender-strong disabled:opacity-60"
    >
      {busy ? "Preparing…" : "Share postcard ↗"}
    </button>
  );
}
