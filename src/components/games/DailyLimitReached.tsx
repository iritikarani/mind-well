import { AppHeader } from "@/components/app/AppHeader";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import type { GameMeta } from "@/lib/games";

export function DailyLimitReachedPage({
  game,
  limit,
  userName,
  streakCount,
}: {
  game: GameMeta;
  limit: number;
  userName: string;
  streakCount?: number;
}) {
  return (
    <>
      <AppHeader name={userName} streak={streakCount} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 sm:px-10">
        <Card className="text-center">
          <div className="text-5xl">🌙</div>
          <h1 className="mt-3 font-heading text-2xl font-bold text-heading">{game.label}</h1>
          <p className="mt-2 text-muted">
            You&apos;ve played {game.label} {limit === 1 ? "once" : `${limit} times`} today —
            that&apos;s all for now. Come back tomorrow for {limit === 1 ? "another round" : "more"}.
          </p>
          <LinkButton href="/games" variant="ghost" className="mt-6">
            ← Back to games
          </LinkButton>
        </Card>
      </main>
    </>
  );
}
