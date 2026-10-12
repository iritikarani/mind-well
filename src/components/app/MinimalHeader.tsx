import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { PixelHeart } from "@/components/pixel/PixelArt";

/** A slim header for public pages that aren't the home page. */
export function MinimalHeader() {
  return (
    <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-10">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-1.5 font-heading text-base font-bold text-heading sm:text-lg"
      >
        <PixelHeart size={20} />
        Happy Space
      </Link>
      <LinkButton href="/login" variant="ghost" className="px-4 py-2 text-sm">
        Sign in
      </LinkButton>
    </header>
  );
}
