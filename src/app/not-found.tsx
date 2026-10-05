import Link from "next/link";
import { PixelCloud } from "@/components/pixel/PixelArt";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <PixelCloud size={56} className="animate-bob" color="#C7B6F0" />
      <h1 className="font-heading text-2xl font-bold text-heading">
        This little corner doesn&apos;t exist <span aria-hidden>☁️</span>
      </h1>
      <p className="max-w-sm text-muted">
        The page you&apos;re looking for drifted off somewhere. Let&apos;s get you back to safe
        ground.
      </p>
      <Link
        href="/"
        className="min-h-11 rounded-full bg-purple px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple/90"
      >
        ♡ Back to Happy Space
      </Link>
    </main>
  );
}
