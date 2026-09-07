import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { ColorTheoryGame } from "@/components/games/color-theory/ColorTheoryGame";
import { DailyLimitReachedPage } from "@/components/games/DailyLimitReached";
import { prisma } from "@/lib/prisma";
import { gameMeta } from "@/lib/games";
import { hasReachedDailyLimit } from "@/lib/playLimit";

export default async function ColorTheoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });

  if (await hasReachedDailyLimit(user.id, "COLOR_THEORY")) {
    return (
      <DailyLimitReachedPage
        game={gameMeta("COLOR_THEORY")!}
        userName={user.name}
        streakCount={streak?.currentCount}
      />
    );
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak?.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <ColorTheoryGame />
      </main>
    </>
  );
}
