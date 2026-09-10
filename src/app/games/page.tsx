import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { GAME_CATEGORIES, GAMES } from "@/lib/games";
import { AppHeader } from "@/components/app/AppHeader";
import { Pill } from "@/components/ui/Pill";
import { getEffectiveStreak } from "@/lib/streak";

export default async function GamesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await getEffectiveStreak(user.id);

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <h1 className="font-heading text-3xl font-bold text-heading">Games</h1>
        <p className="mt-1 text-muted">Pick whatever fits your mood right now.</p>

        {GAME_CATEGORIES.map((category) => (
          <section key={category} className="mt-10">
            <h2 className="font-heading text-xl font-bold text-heading">{category}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.filter((g) => g.category === category).map((game) => (
                <Link
                  key={game.key}
                  href={game.href}
                  className="rounded-[20px] bg-surface p-5 shadow-[0_4px_20px_rgba(122,59,87,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(122,59,87,0.12)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{game.emoji}</div>
                    {!game.playable && <Pill tone="muted">Coming soon</Pill>}
                  </div>
                  <p className="mt-2 font-heading font-semibold text-heading">{game.label}</p>
                  <p className="mt-1 text-sm text-muted">{game.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
