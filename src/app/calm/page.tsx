import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getEffectiveStreak } from "@/lib/streak";
import { AppHeader } from "@/components/app/AppHeader";
import { MinimalHeader } from "@/components/app/MinimalHeader";
import { CalmCorner } from "@/components/calm/CalmCorner";

export const metadata: Metadata = {
  title: "Calm corner",
  description:
    "A free breathing pacer and soft soundscapes — rain, ocean waves, a fireplace — to settle your mind. No sign-up needed.",
};

export default async function CalmPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <>
        <MinimalHeader />
        <CalmCorner loggedIn={false} />
      </>
    );
  }

  const streak = await getEffectiveStreak(user.id);
  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <CalmCorner loggedIn />
    </>
  );
}
