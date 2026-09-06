import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { GAMES, gameMeta } from "@/lib/games";
import { monumentById } from "@/lib/worldPuzzleContent";
import { AppHeader } from "@/components/app/AppHeader";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { LinkButton } from "@/components/ui/Button";

function summarizePlay(game: string, resultJson: string): string {
  try {
    const result = JSON.parse(resultJson);
    if (game === "ANIMAL_RUNNER") {
      return result.survived
        ? `Survived · ${result.heartsRemaining}/10 hearts left`
        : "Game over";
    }
    if (game === "THREE_THINGS") {
      return `${result.entriesCount} thing${result.entriesCount === 1 ? "" : "s"} saved`;
    }
    if (game === "COLOR_THEORY") {
      const color = result.color?.charAt(0).toUpperCase() + result.color?.slice(1);
      return `${color} · ${result.questionsAnswered}/${result.totalQuestions} answered`;
    }
    if (game === "WORLD_PUZZLE") {
      const monument = monumentById(result.monumentId);
      return monument ? `${monument.name}, ${monument.country}` : "Puzzle completed";
    }
    return "Played";
  } catch {
    return "Played";
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [streak, badges, plays, totalPlays] = await Promise.all([
    prisma.streak.findUnique({ where: { userId: user.id } }),
    prisma.userBadge.findMany({
      where: { userId: user.id },
      orderBy: { earnedAt: "desc" },
    }),
    prisma.gamePlay.findMany({
      where: { userId: user.id },
      orderBy: { playedAt: "desc" },
      take: 8,
    }),
    prisma.gamePlay.count({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <AppHeader name={user.name} streak={streak?.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <h1 className="font-heading text-3xl font-bold text-heading">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted">Take a breath. What would you like to do today?</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Current streak
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">
              {streak?.currentCount ?? 0} 🔥
            </p>
            <p className="mt-1 text-sm text-muted">
              Longest: {streak?.longestCount ?? 0} day{streak?.longestCount === 1 ? "" : "s"}
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Badges earned
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">{badges.length}</p>
            <p className="mt-1 text-sm text-muted">Out of {Object.keys(BADGE_CATALOG).length} total</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Games played
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">{totalPlays}</p>
            <p className="mt-1 text-sm text-muted">Recent activity below</p>
          </Card>
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-heading">Games</h2>
            <LinkButton href="/games" variant="ghost" className="px-3 py-1.5 text-sm">
              See all →
            </LinkButton>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GAMES.map((game) => (
              <a
                key={game.key}
                href={game.href}
                className="rounded-[20px] bg-surface p-5 shadow-[0_4px_20px_rgba(122,59,87,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(122,59,87,0.12)]"
              >
                <div className="text-3xl">{game.emoji}</div>
                <p className="mt-2 font-heading font-semibold text-heading">{game.label}</p>
                <p className="mt-1 text-xs text-muted">{game.category}</p>
                {!game.playable && <Pill tone="muted" className="mt-2">Coming soon</Pill>}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-heading">Badges</h2>
          {badges.length === 0 ? (
            <Card className="mt-4">
              <p className="text-sm text-muted">
                No badges yet — play a game to start earning them.
              </p>
            </Card>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((b) => {
                const meta = BADGE_CATALOG[b.badgeKey as BadgeKey];
                if (!meta) return null;
                return (
                  <Card key={b.id} className="p-4">
                    <p className="font-heading font-semibold text-heading">🏅 {meta.label}</p>
                    <p className="mt-1 text-xs text-muted">{meta.description}</p>
                    <p className="mt-2 text-[11px] text-muted">
                      Earned {format(b.earnedAt, "MMM d, yyyy")}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-heading">Game history</h2>
          {plays.length === 0 ? (
            <Card className="mt-4">
              <p className="text-sm text-muted">Your game history will show up here.</p>
            </Card>
          ) : (
            <Card className="mt-4 divide-y divide-black/5 p-0">
              {plays.map((play) => {
                const meta = gameMeta(play.game);
                return (
                  <div key={play.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{meta?.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-heading">{meta?.label}</p>
                        <p className="text-xs text-muted">{summarizePlay(play.game, play.result)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted">{format(play.playedAt, "MMM d, h:mm a")}</p>
                  </div>
                );
              })}
            </Card>
          )}
        </section>
      </main>
    </>
  );
}
