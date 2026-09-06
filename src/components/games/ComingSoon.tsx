import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/app/AppHeader";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import type { GameMeta } from "@/lib/games";

export async function ComingSoonGamePage({
  game,
  plannedMechanics,
}: {
  game: GameMeta;
  plannedMechanics: string[];
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });

  return (
    <>
      <AppHeader name={user.name} streak={streak?.currentCount} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 sm:px-10">
        <Card className="text-center">
          <div className="text-5xl">{game.emoji}</div>
          <h1 className="mt-3 font-heading text-2xl font-bold text-heading">{game.label}</h1>
          <p className="mt-2 text-muted">{game.tagline}</p>
          <p className="mt-4 rounded-xl bg-sky px-4 py-2 text-sm font-semibold text-sky-text">
            Coming soon
          </p>

          <div className="mt-6 rounded-2xl bg-white/60 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              What&apos;s planned
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-heading">
              {plannedMechanics.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blush-strong">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <LinkButton href="/games" variant="ghost" className="mt-6">
            ← Back to games
          </LinkButton>
        </Card>
      </main>
    </>
  );
}
