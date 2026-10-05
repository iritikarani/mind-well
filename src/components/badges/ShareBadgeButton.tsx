"use client";

import { useState } from "react";
import { shareOrDownloadBadge } from "@/lib/badgeShareImage";

export function ShareBadgeButton({
  label,
  description,
  userName,
  dateLabel,
}: {
  label: string;
  description: string;
  userName: string;
  dateLabel: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      await shareOrDownloadBadge({ label, description, userName, dateLabel });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="mt-2 min-h-11 rounded-full bg-lavender px-3 py-1.5 text-xs font-semibold text-lavender-text hover:bg-lavender-strong disabled:opacity-60"
    >
      {busy ? "Preparing…" : "Share ↗"}
    </button>
  );
}
