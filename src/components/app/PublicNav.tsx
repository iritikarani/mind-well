"use client";

import Link from "next/link";
import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { PixelHeart } from "@/components/pixel/PixelArt";
import { MobileNavCategory } from "@/components/app/MobileNavCategory";

const NAV_LINKS = [
  { href: "#top", label: "Home" },
  { href: "#validation", label: "Validation?" },
  { href: "#threads", label: "Threads" },
  { href: "#mind-flow", label: "Mind Flow" },
  { href: "#3-things", label: "3 Things" },
];

const NAV_CATEGORIES = ["Validation?", "Threads", "Mind Flow", "3 Things"];

export function PublicNav({ loggedIn }: { loggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-20 px-4 py-4 sm:px-10">
      <div className="flex items-center justify-between gap-3">
        <a href="#top" className="flex shrink-0 items-center gap-1.5 font-heading text-base font-bold text-heading sm:text-lg">
          <PixelHeart size={20} />
          Happy Space
        </a>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-sm font-semibold text-heading/80 hover:text-purple"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href={loggedIn ? "/dashboard" : "/login"} variant="outline" className="px-5 py-2 text-sm">
            {loggedIn ? "Profile" : "Login"}
          </LinkButton>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="public-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white/70 text-heading lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            {menuOpen ? (
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          id="public-nav-menu"
          className="pixel-panel absolute left-4 right-4 top-full mt-2 rounded-2xl bg-surface p-4 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Main">
            <a
              href="#top"
              onClick={() => setMenuOpen(false)}
              className="min-h-11 rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-heading hover:bg-lavender/40"
            >
              Home
            </a>
            {NAV_CATEGORIES.map((category) => (
              <MobileNavCategory
                key={category}
                label={category}
                onNavigate={() => setMenuOpen(false)}
              />
            ))}
            <Link
              href={loggedIn ? "/dashboard" : "/login"}
              onClick={() => setMenuOpen(false)}
              className="min-h-11 rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-purple-text hover:bg-lavender/40"
            >
              {loggedIn ? "Profile" : "Login"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
