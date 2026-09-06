import { getCurrentUser } from "@/lib/auth";
import { LinkButton } from "@/components/ui/Button";
import { FloatingScene } from "@/components/home/FloatingScene";

export default async function Home() {
  const user = await getCurrentUser();
  const startHref = user ? "/dashboard" : "/login";

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
      <FloatingScene />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="animate-breathe h-28 w-28 rounded-full bg-gradient-to-br from-blush-strong to-sky shadow-lg" />

        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-bold text-heading sm:text-5xl">
            Mind Well
          </h1>
          <p className="max-w-md text-lg text-muted">
            A quiet corner for your mind.
          </p>
        </div>

        <LinkButton href={startHref} className="px-10 py-4 text-lg">
          Start
        </LinkButton>
      </div>
    </main>
  );
}
