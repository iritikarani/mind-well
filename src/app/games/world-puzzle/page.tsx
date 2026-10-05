import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/app/AppHeader";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { WorldPuzzleGame } from "@/components/games/world-puzzle/WorldPuzzleGame";
import { PostcardReveal } from "@/components/games/world-puzzle/PostcardReveal";
import { getEffectiveStreak } from "@/lib/streak";
import { hasReachedDailyLimit } from "@/lib/playLimit";
import { monumentById, postcardNote, randomQuote } from "@/lib/worldPuzzleContent";
import { startOfDayInZone } from "@/lib/date";
import { getUserTimeZone } from "@/lib/timezone";

export default async function WorldPuzzlePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await getEffectiveStreak(user.id);

  if (await hasReachedDailyLimit(user.id, "WORLD_PUZZLE")) {
    const timeZone = await getUserTimeZone();
    const dayStart = startOfDayInZone(timeZone);
    const todaysPlay = await prisma.gamePlay.findFirst({
      where: { userId: user.id, game: "WORLD_PUZZLE", playedAt: { gte: dayStart } },
      orderBy: { playedAt: "desc" },
      select: { result: true },
    });

    let monument = null;
    try {
      const { monumentId } = JSON.parse(todaysPlay?.result ?? "{}") as { monumentId?: string };
      monument = monumentId ? monumentById(monumentId) : null;
    } catch {
      // ignore malformed rows
    }

    return (
      <>
        <AppHeader name={user.name} streak={streak.currentCount} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 sm:px-10">
          <div className="mx-auto max-w-lg text-center">
            <Card className="p-8">
              {monument ? (
                <PostcardReveal
                  monument={monument}
                  quote={randomQuote()}
                  note={postcardNote(monument)}
                  userName={user.name}
                />
              ) : (
                <div className="text-5xl">🌙</div>
              )}
              <p className="mt-5 text-muted">
                You&apos;ve taken enough time for yourself today. <span aria-hidden>♡</span> Come
                back tomorrow.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <LinkButton href="/games/world-puzzle/my-world" variant="lavender">
                  My World 🗺️
                </LinkButton>
                <LinkButton href="/dashboard">Back to dashboard</LinkButton>
              </div>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <WorldPuzzleGame userName={user.name} />
      </main>
    </>
  );
}
