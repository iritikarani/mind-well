import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveStreak } from "@/lib/streak";
import { AppHeader } from "@/components/app/AppHeader";
import { LinkButton } from "@/components/ui/Button";
import { monumentById } from "@/lib/worldPuzzleContent";

export default async function MyWorldPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [streak, plays] = await Promise.all([
    getEffectiveStreak(user.id),
    prisma.gamePlay.findMany({
      where: { userId: user.id, game: "WORLD_PUZZLE" },
      orderBy: { playedAt: "desc" },
      select: { result: true, playedAt: true },
    }),
  ]);

  const seen = new Set<string>();
  const postcards: { id: string; playedAt: Date }[] = [];
  for (const play of plays) {
    try {
      const { monumentId } = JSON.parse(play.result) as { monumentId?: string };
      if (monumentId && !seen.has(monumentId)) {
        seen.add(monumentId);
        postcards.push({ id: monumentId, playedAt: play.playedAt });
      }
    } catch {
      // ignore malformed rows
    }
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 sm:px-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-heading">My World 🗺️</h1>
            <p className="mt-1 text-muted">
              {postcards.length === 0
                ? "Your postcard album is waiting for its first stamp."
                : `${postcards.length} destination${postcards.length === 1 ? "" : "s"} collected so far.`}
            </p>
          </div>
          <LinkButton href="/games/world-puzzle" variant="ghost" className="px-3 py-1.5 text-sm">
            ← Back to puzzle
          </LinkButton>
        </div>

        {postcards.length === 0 ? (
          <div className="pixel-panel mt-8 rounded-[22px] bg-surface p-8 text-center">
            <p className="text-muted">
              Complete a World Puzzle to start your collection. Every finished puzzle becomes a
              little postcard here. ♡
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {postcards.map(({ id, playedAt }) => {
              const monument = monumentById(id);
              if (!monument) return null;
              return (
                <div
                  key={id}
                  className="pixel-panel overflow-hidden rounded-[20px] bg-surface"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={monument.image}
                    alt={monument.name}
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="font-heading font-semibold text-heading">{monument.name}</p>
                    <p className="text-xs text-muted">{monument.country}</p>
                    <p className="mt-1 text-[11px] text-muted">
                      Collected {playedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
