import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveStreak } from "@/lib/streak";
import { getUserTimeZone } from "@/lib/timezone";
import { formatDateInZone } from "@/lib/date";
import { AppHeader } from "@/components/app/AppHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { gameMeta } from "@/lib/games";
import { cn } from "@/lib/cn";

export default async function BadgesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [streak, timeZone, earned] = await Promise.all([
    getEffectiveStreak(user.id),
    getUserTimeZone(),
    prisma.userBadge.findMany({ where: { userId: user.id } }),
  ]);

  const earnedByKey = new Map(earned.map((b) => [b.badgeKey, b.earnedAt]));
  const catalogKeys = Object.keys(BADGE_CATALOG) as BadgeKey[];
  const totalCount = catalogKeys.length;
  const earnedCount = earned.length;

  const sections = new Map<string, { title: string; emoji: string; keys: BadgeKey[] }>();
  for (const key of catalogKeys) {
    const meta = BADGE_CATALOG[key];
    const groupId = meta.game ?? "HAPPY_SPACE";
    if (!sections.has(groupId)) {
      const game = meta.game ? gameMeta(meta.game) : null;
      sections.set(groupId, {
        title: game ? game.label : "Happy Space",
        emoji: game ? game.emoji : "♡",
        keys: [],
      });
    }
    sections.get(groupId)!.keys.push(key);
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold text-heading">My Badges ♡</h1>
            <p className="mt-1 text-muted">
              {earnedCount} of {totalCount} collected so far.
            </p>
          </div>
          <LinkButton href="/dashboard" variant="ghost" className="px-3 py-1.5 text-sm">
            ← Back to dashboard
          </LinkButton>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href="/games/world-puzzle/my-world"
            className="pixel-panel pixel-pressable rounded-[20px] bg-surface p-5 shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
          >
            <div className="text-3xl">🗺️</div>
            <p className="mt-2 font-heading font-semibold text-heading">My World</p>
            <p className="mt-1 text-xs text-muted">
              Postcards from every destination you&apos;ve pieced together.
            </p>
          </a>
          <a
            href="/games/color-theory/my-colors"
            className="pixel-panel pixel-pressable rounded-[20px] bg-surface p-5 shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
          >
            <div className="text-3xl">🎨</div>
            <p className="mt-2 font-heading font-semibold text-heading">My Colors</p>
            <p className="mt-1 text-xs text-muted">
              Every keepsake badge you&apos;ve earned from Color Connection.
            </p>
          </a>
        </div>

        {[...sections.values()].map((section) => (
          <section key={section.title} className="mt-10">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-heading">
              <span aria-hidden>{section.emoji}</span> {section.title}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.keys.map((key) => {
                const meta = BADGE_CATALOG[key];
                const earnedAt = earnedByKey.get(key);
                return (
                  <Card key={key} className={cn("p-4", !earnedAt && "opacity-60")}>
                    <p className="font-heading font-semibold text-heading">
                      <span aria-hidden>{earnedAt ? "🏅" : "🔒"}</span> {meta.label}
                    </p>
                    <p className="mt-1 text-xs text-muted">{meta.description}</p>
                    <p className="mt-2 text-[11px] text-muted">
                      {earnedAt ? `Earned ${formatDateInZone(earnedAt, timeZone)}` : "Not yet earned"}
                    </p>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
