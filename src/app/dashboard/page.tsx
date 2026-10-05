import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { formatDateInZone, startOfDayInZone } from "@/lib/date";
import { getUserTimeZone } from "@/lib/timezone";
import { getEffectiveStreak } from "@/lib/streak";
import { prisma } from "@/lib/prisma";
import { BADGE_CATALOG, type BadgeKey } from "@/lib/badges";
import { GAMES } from "@/lib/games";
import { AppHeader } from "@/components/app/AppHeader";
import { MoodCheckIn } from "@/components/app/MoodCheckIn";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ShareBadgeButton } from "@/components/badges/ShareBadgeButton";
import { colorByKey } from "@/lib/colorTheoryContent";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const timeZone = await getUserTimeZone();
  const dayStart = startOfDayInZone(timeZone);
  const DAY_MS = 24 * 60 * 60 * 1000;
  const weekStart = new Date(dayStart.getTime() - 6 * DAY_MS);

  const [streak, badges, playsToday, journalCount, colorPlays, weekPlays] =
    await Promise.all([
      getEffectiveStreak(user.id),
      prisma.userBadge.findMany({
        where: { userId: user.id },
        orderBy: { earnedAt: "desc" },
      }),
      prisma.gamePlay.count({ where: { userId: user.id, playedAt: { gte: dayStart } } }),
      prisma.journalEntry.count({ where: { userId: user.id } }),
      prisma.gamePlay.findMany({
        where: { userId: user.id, game: "COLOR_THEORY" },
        select: { result: true },
      }),
      prisma.gamePlay.findMany({
        where: { userId: user.id, playedAt: { gte: weekStart } },
        select: { playedAt: true },
      }),
    ]);

  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(weekStart.getTime() + i * DAY_MS);
    const nextDayDate = new Date(dayDate.getTime() + DAY_MS);
    const count = weekPlays.filter(
      (p) => p.playedAt >= dayDate && p.playedAt < nextDayDate,
    ).length;
    const label = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone }).format(
      dayDate,
    );
    return { label, count };
  });
  const maxWeeklyCount = Math.max(1, ...weeklyActivity.map((d) => d.count));

  const QUICK_ACTION_KEYS = ["THREE_THINGS", "SPIN_AND_CONNECT", "FIND_THE_WORD", "ANAGRAMS"] as const;
  const quickActions = QUICK_ACTION_KEYS.map((key) => GAMES.find((g) => g.key === key)).filter(
    (g): g is NonNullable<typeof g> => !!g,
  );

  const favoriteColor = (() => {
    const counts = new Map<string, number>();
    for (const play of colorPlays) {
      try {
        const { color } = JSON.parse(play.result) as { color?: string };
        if (color) counts.set(color, (counts.get(color) ?? 0) + 1);
      } catch {
        // ignore malformed rows
      }
    }
    let best: string | null = null;
    let bestCount = 0;
    for (const [color, count] of counts) {
      if (count > bestCount) {
        best = color;
        bestCount = count;
      }
    }
    return best ? colorByKey(best) : null;
  })();

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-10">
        <h1 className="font-heading text-3xl font-bold text-heading">
          Hi, {user.name.split(" ")[0]} <span aria-hidden>♡</span>
        </h1>

        <Card className="mt-6">
          <MoodCheckIn />
        </Card>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {quickActions.map((game) => (
            <a
              key={game.key}
              href={game.href}
              className="pixel-pressable flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-lavender px-4 py-2 text-sm font-semibold text-lavender-text hover:bg-lavender-strong"
            >
              <span aria-hidden>{game.emoji}</span> {game.label}
            </a>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <a
            href="#weekly-activity"
            className="pixel-panel pixel-pressable rounded-[22px] bg-surface p-6 text-left shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Current streak
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">
              {streak.currentCount} 🔥
            </p>
            <p className="mt-1 text-sm text-muted">
              {streak.currentCount > 0
                ? `Longest: ${streak.longestCount} day${streak.longestCount === 1 ? "" : "s"}`
                : "Ready for another little moment for yourself? ♡"}
            </p>
          </a>
          <a
            href="/badges"
            className="pixel-panel pixel-pressable rounded-[22px] bg-surface p-6 shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Badges earned
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">{badges.length}</p>
            <p className="mt-1 text-sm text-muted">See your badge shelf →</p>
          </a>
          <a
            href="#weekly-activity"
            className="pixel-panel pixel-pressable rounded-[22px] bg-surface p-6 text-left shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Games played today
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">{playsToday}</p>
            <p className="mt-1 text-sm text-muted">See this week&apos;s activity →</p>
          </a>
          <a
            href="/games/color-theory/my-colors"
            className="pixel-panel pixel-pressable rounded-[22px] bg-surface p-6 text-left shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Favorite color
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">
              {favoriteColor ? favoriteColor.label : "—"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {favoriteColor ? "See My Colors →" : "Play Color Connection to find out"}
            </p>
          </a>
          <a
            href="/games/three-things"
            className="pixel-panel pixel-pressable rounded-[22px] bg-surface p-6 text-left shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Journal entries
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-heading">{journalCount}</p>
            <p className="mt-1 text-sm text-muted">Jot another thing →</p>
          </a>
        </div>

        <section id="weekly-activity" className="mt-10 scroll-mt-24">
          <h2 className="font-heading text-xl font-bold text-heading">This week</h2>
          <Card className="mt-4">
            <div className="flex gap-2" style={{ height: 120 }}>
              {weeklyActivity.map((day, i) => (
                <div key={i} className="flex flex-1 items-end">
                  <div
                    className={day.count > 0 ? "w-full rounded-t-md bg-purple" : "w-full rounded-t-md bg-lavender/60"}
                    style={{ height: `${Math.max(6, (day.count / maxWeeklyCount) * 100)}%` }}
                    title={`${day.count} game${day.count === 1 ? "" : "s"}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {weeklyActivity.map((day, i) => (
                <span key={i} className="flex-1 text-center text-[11px] font-semibold text-muted">
                  {day.label}
                </span>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              {weekPlays.length === 0
                ? "No games yet this week — no rush, come back whenever you'd like. ♡"
                : `${weekPlays.length} game${weekPlays.length === 1 ? "" : "s"} played this week.`}
            </p>
          </Card>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-heading">Badges</h2>
            <LinkButton href="/badges" variant="ghost" className="px-3 py-1.5 text-sm">
              See all →
            </LinkButton>
          </div>
          {badges.length === 0 ? (
            <Card className="mt-4">
              <p className="text-sm text-muted">
                Your badge shelf is waiting for its first little achievement. ✨
              </p>
            </Card>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((b) => {
                const meta = BADGE_CATALOG[b.badgeKey as BadgeKey];
                if (!meta) return null;
                return (
                  <Card key={b.id} className="p-4">
                    <p className="font-heading font-semibold text-heading">🏅 {meta.label}</p>
                    <p className="mt-1 text-xs text-muted">{meta.description}</p>
                    <p className="mt-2 text-[11px] text-muted">
                      Earned {formatDateInZone(b.earnedAt, timeZone)}
                    </p>
                    <ShareBadgeButton
                      label={meta.label}
                      description={meta.description}
                      userName={user.name}
                      dateLabel={formatDateInZone(b.earnedAt, timeZone)}
                    />
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
