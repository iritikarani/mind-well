import { getCurrentUser } from "@/lib/auth";
import { LinkButton } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { HeroScene } from "@/components/home/HeroScene";
import { PublicNav } from "@/components/app/PublicNav";
import { PixelHeart, PixelBook } from "@/components/pixel/PixelArt";
import { GAMES, CATEGORY_META, categorySlug, type GameMeta } from "@/lib/games";

const SECTION_ORDER: (typeof GAMES)[number]["category"][] = [
  "Validation?",
  "Threads",
  "Mind Flow",
  "3 Things",
];

export default async function Home() {
  const user = await getCurrentUser();
  const startHref = user ? "/dashboard" : "/login";

  return (
    <>
      <PublicNav loggedIn={!!user} />

      <main className="relative flex-1 overflow-x-hidden">
        <section
          id="top"
          className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
        >
          <HeroScene />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h1 className="font-pixel text-2xl leading-relaxed text-heading sm:text-3xl">
              HAPPY SPACE <span aria-hidden>♡</span>
              <span className="sr-only">heart</span>
            </h1>

            <div className="max-w-md space-y-2">
              <p className="font-heading text-xl font-semibold text-purple-text sm:text-2xl">
                &quot;Emotions are valued and validated.&quot;
              </p>
              <p className="text-base text-muted">
                A small pixelated world for your mental health.
              </p>
            </div>

            <LinkButton href={startHref} className="px-10 py-4 text-lg">
              <span aria-hidden>♡</span> LET&apos;S START
            </LinkButton>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-10">
          <div className="grid gap-6 sm:grid-cols-2">
            {SECTION_ORDER.map((category) => (
              <CategoryCard
                key={category}
                category={category}
                games={GAMES.filter((g) => g.category === category)}
                href={user ? `/games#${categorySlug(category)}` : "/login"}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl px-6 pb-20 pt-6 text-center">
          <div className="flex justify-center">
            <PixelHeart size={28} />
          </div>
          <p className="mt-4 font-heading text-lg font-semibold text-heading sm:text-xl">
            You don&apos;t have to feel okay all the time.
            <br />
            You just need a little space to feel. <span aria-hidden>♡</span>
          </p>
        </section>
      </main>
    </>
  );
}

function CategoryCard({
  category,
  games,
  href,
}: {
  category: string;
  games: GameMeta[];
  href: string;
}) {
  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
  return (
    <a
      href={href}
      className="pixel-panel pixel-pressable flex flex-col gap-3 rounded-[22px] bg-surface p-6 text-left shadow-[0_4px_20px_rgba(91,71,137,0.1)] transition hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-heading">{category}</h2>
        <PixelBook size={20} />
      </div>
      <Pill tone={meta.tone} className="w-fit">
        {meta.tagline}
      </Pill>
      <ul className="mt-1 space-y-1">
        {games.map((g) => (
          <li key={g.key} className="flex items-center gap-2 text-sm text-muted">
            <span aria-hidden>{g.emoji}</span>
            {g.label}
          </li>
        ))}
      </ul>
    </a>
  );
}
