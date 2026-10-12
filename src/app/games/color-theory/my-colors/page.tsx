import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEffectiveStreak } from "@/lib/streak";
import { AppHeader } from "@/components/app/AppHeader";
import { LinkButton } from "@/components/ui/Button";
import { colorByKey } from "@/lib/colorTheoryContent";

export default async function MyColorsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [streak, plays] = await Promise.all([
    getEffectiveStreak(user.id),
    prisma.gamePlay.findMany({
      where: { userId: user.id, game: "COLOR_THEORY" },
      orderBy: { playedAt: "desc" },
      select: { result: true, playedAt: true },
    }),
  ]);

  const seen = new Set<string>();
  const entries: { color: string; playedAt: Date }[] = [];
  for (const play of plays) {
    try {
      const { color } = JSON.parse(play.result) as { color?: string };
      if (color && !seen.has(color)) {
        seen.add(color);
        entries.push({ color, playedAt: play.playedAt });
      }
    } catch {
      // ignore malformed rows
    }
  }

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 sm:px-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-heading">My Colors 🎨</h1>
            <p className="mt-1 text-muted">
              {entries.length === 0
                ? "Your color collection is just getting started."
                : `${entries.length} color${entries.length === 1 ? "" : "s"} reflected on so far.`}
            </p>
          </div>
          <LinkButton href="/games/color-theory" variant="ghost" className="px-3 py-1.5 text-sm">
            ← Back to Color Connection
          </LinkButton>
        </div>

        {entries.length === 0 ? (
          <div className="pixel-panel mt-8 rounded-[22px] bg-surface p-8 text-center">
            <p className="text-muted">
              Play Color Connection to start collecting colors. Each one leaves behind a little
              keepsake here. ♡
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map(({ color, playedAt }) => {
              const def = colorByKey(color);
              return (
                <div key={color} className="pixel-panel rounded-[20px] bg-surface p-5">
                  <span
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl shadow-sm"
                    style={{
                      backgroundColor: def.hex,
                      border: def.border ? "1px solid rgba(0,0,0,0.08)" : undefined,
                    }}
                  >
                    <span aria-hidden>♡</span>
                  </span>
                  <p className="mt-3 text-center font-heading font-semibold text-heading">
                    {def.label} Soul
                  </p>
                  <p className="text-center text-xs text-muted">{def.affirmation}</p>
                  <p className="mt-2 text-center text-[11px] text-muted">
                    Collected {playedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
