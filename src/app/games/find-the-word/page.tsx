import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/app/AppHeader";
import { FindTheWordGame } from "@/components/games/find-the-word/FindTheWordGame";
import { prisma } from "@/lib/prisma";

export default async function FindTheWordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const streak = await prisma.streak.findUnique({ where: { userId: user.id } });

  return (
    <>
      <AppHeader name={user.name} streak={streak?.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <FindTheWordGame />
      </main>
    </>
  );
}
