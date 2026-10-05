"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pill } from "@/components/ui/Pill";
import { PixelHeart } from "@/components/pixel/PixelArt";
import { MobileNavCategory } from "@/components/app/MobileNavCategory";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/games#validation", label: "Validation?" },
  { href: "/games#threads", label: "Threads" },
  { href: "/games#mind-flow", label: "Mind Flow" },
  { href: "/games#3-things", label: "3 Things" },
];

const NAV_CATEGORIES = ["Validation?", "Threads", "Mind Flow", "3 Things"];

export function AppHeader({
  name,
  streak,
}: {
  name: string;
  streak?: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="relative px-4 py-4 sm:px-10">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-1.5 font-heading text-base font-bold text-heading sm:text-lg"
        >
          <PixelHeart size={20} />
          Happy Space
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-sm font-semibold text-heading/80 hover:text-purple"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {typeof streak === "number" && streak > 0 && (
            <Pill tone="butter">🔥 {streak}-day streak</Pill>
          )}
          <span className="text-sm font-medium text-muted">Hi, {name}</span>
          <button
            onClick={logout}
            disabled={loading}
            className="min-h-11 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-heading hover:bg-white disabled:opacity-50"
          >
            Log out
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white/70 text-heading lg:hidden"
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav-menu"
          className="pixel-panel absolute left-4 right-4 top-full z-30 mt-2 rounded-2xl bg-surface p-4 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Main">
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="min-h-11 rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-heading hover:bg-lavender/40"
            >
              Home
            </Link>
            {NAV_CATEGORIES.map((category) => (
              <MobileNavCategory
                key={category}
                label={category}
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-lavender/60 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted">Hi, {name}</span>
              {typeof streak === "number" && streak > 0 && (
                <Pill tone="butter">🔥 {streak}</Pill>
              )}
            </div>
            <button
              onClick={logout}
              disabled={loading}
              className="min-h-11 rounded-full bg-white px-4 py-2 text-xs font-semibold text-heading hover:bg-lavender/40 disabled:opacity-50"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      {open ? (
        <path
          d="M5 5L15 15M15 5L5 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 5H17M3 10H17M3 15H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
