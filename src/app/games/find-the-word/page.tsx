import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { FindTheWordGame } from "@/components/games/find-the-word/FindTheWordGame";
import { DailyLimitReachedPage } from "@/components/games/DailyLimitReached";
import { getEffectiveStreak } from "@/lib/streak";
import { prisma } from "@/lib/prisma";
import { gameMeta } from "@/lib/games";
import { DAILY_PLAY_LIMITS, getPlaysToday, hasReachedDailyLimit } from "@/lib/playLimit";

export default async function FindTheWordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await getEffectiveStreak(user.id);

  if (await hasReachedDailyLimit(user.id, "FIND_THE_WORD")) {
    return (
      <DailyLimitReachedPage
        game={gameMeta("FIND_THE_WORD")!}
        userName={user.name}
        streakCount={streak.currentCount}
      />
    );
  }

  const playsToday = await getPlaysToday(user.id, "FIND_THE_WORD");
  const playsRemaining = DAILY_PLAY_LIMITS.FIND_THE_WORD! - playsToday;

  // Loaded once up front so picking a question after each found word is
  // instant in the browser — it only needs to know which variant each word
  // showed last time, to avoid repeating it.
  const pastPlays = await prisma.gamePlay.findMany({
    where: { userId: user.id, game: "FIND_THE_WORD" },
    orderBy: { playedAt: "desc" },
    select: { result: true },
  });
  const lastVariantByWord: Record<string, number> = {};
  for (const play of pastPlays) {
    try {
      const { wordsFound } = JSON.parse(play.result) as {
        wordsFound?: { word: string; variantIndex: number }[];
      };
      for (const entry of wordsFound ?? []) {
        if (!(entry.word in lastVariantByWord)) lastVariantByWord[entry.word] = entry.variantIndex;
      }
    } catch {
      // ignore malformed rows
    }
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <FindTheWordGame playsRemaining={playsRemaining} lastVariantByWord={lastVariantByWord} />
      </main>
    </>
  );
}
