import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { FindTheWordGame } from "@/components/games/find-the-word/FindTheWordGame";
import { DailyLimitReachedPage } from "@/components/games/DailyLimitReached";
import { prisma } from "@/lib/prisma";
import { gameMeta } from "@/lib/games";
import { hasReachedDailyLimit } from "@/lib/playLimit";

export default async function FindTheWordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });

  if (await hasReachedDailyLimit(user.id, "FIND_THE_WORD")) {
    return (
      <DailyLimitReachedPage
        game={gameMeta("FIND_THE_WORD")!}
        userName={user.name}
        streakCount={streak?.currentCount}
      />
    );
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak?.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <FindTheWordGame />
      </main>
    </>
  );
}
