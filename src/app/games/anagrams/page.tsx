import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { AnagramsGame } from "@/components/games/anagrams/AnagramsGame";
import { getEffectiveStreak } from "@/lib/streak";

export default async function AnagramsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await getEffectiveStreak(user.id);

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <AnagramsGame />
      </main>
    </>
  );
}
