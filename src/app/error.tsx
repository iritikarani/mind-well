"use client";

import { useEffect } from "react";
import { PixelHeart } from "@/components/pixel/PixelArt";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <PixelHeart size={48} className="animate-bob" color="#C7B6F0" shade="#9E8BC9" />
      <h1 className="font-heading text-2xl font-bold text-heading">
        Oops! Something doesn&apos;t look right. <span aria-hidden>♡</span>
      </h1>
      <p className="max-w-sm text-muted">Try again in a moment — your data is safe.</p>
      <button
        onClick={reset}
        className="min-h-11 rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple/90"
      >
        Try again
      </button>
    </main>
  );
}
