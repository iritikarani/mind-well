import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: "Happy Space is a small, cozy place to feel a little lighter.",
};

export default function AboutPage() {
  return (
    <LegalShell title="About">
      <p className="text-lg font-semibold text-heading">
        Happy Space is a small, cozy place to feel a little lighter.
      </p>
      <p>
        It&apos;s a room that matches your mood, a letter waiting for you each day, a calm corner for
        breathing and soft sounds, and seven gentle games: Basket Buddies, Postcard Puzzles, Hue Hugs,
        Whimsy Wheels, Word Nest, Alphabet Soup and Tiny Treasures.
      </p>
      <p>
        There&apos;s no leaderboard and no one to compete with. Come when you like, leave when you like
        — your room will be here.
      </p>
      <p className="text-sm text-muted">
        Happy Space is a self-care companion, not therapy or medical advice.
      </p>
      <div className="pt-2">
        <LinkButton href="/">Back home</LinkButton>
      </div>
    </LegalShell>
  );
}
