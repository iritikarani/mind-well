import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { WorldPuzzleGame } from "@/components/games/world-puzzle/WorldPuzzleGame";
import { DailyLimitReachedPage } from "@/components/games/DailyLimitReached";
import { prisma } from "@/lib/prisma";
import { gameMeta } from "@/lib/games";
import { DAILY_PLAY_LIMITS, hasReachedDailyLimit } from "@/lib/playLimit";

export default async function WorldPuzzlePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });

  if (await hasReachedDailyLimit(user.id, "WORLD_PUZZLE")) {
    return (
      <DailyLimitReachedPage
        game={gameMeta("WORLD_PUZZLE")!}
        limit={DAILY_PLAY_LIMITS.WORLD_PUZZLE!}
        userName={user.name}
        streakCount={streak?.currentCount}
      />
    );
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak?.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <WorldPuzzleGame />
      </main>
    </>
  );
}
