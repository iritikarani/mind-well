import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { AnimalRunnerGame } from "@/components/games/animal-runner/AnimalRunnerGame";
import { getEffectiveStreak } from "@/lib/streak";

export const metadata: Metadata = { title: "Animal Runner" };

export default async function AnimalRunnerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await getEffectiveStreak(user.id);

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <AnimalRunnerGame />
      </main>
    </>
  );
}
