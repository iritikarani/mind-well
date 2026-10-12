import { BreathingPacer } from "@/components/calm/BreathingPacer";
import { SoundMixer } from "@/components/calm/SoundMixer";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export function CalmCorner({ loggedIn }: { loggedIn: boolean }) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 space-y-5 px-4 pb-12 sm:px-6">
      <div className="px-1">
        <h1 className="font-heading text-3xl font-bold text-heading">
          Calm corner <span aria-hidden>🕯️</span>
        </h1>
        <p className="mt-1 text-sm text-muted">
          Two minutes is plenty. Breathe, add some soft sound, and let the rest of the day wait.
        </p>
      </div>

      <Card className="p-6 text-center">
        <h2 className="font-heading text-lg font-bold text-heading">Breathe</h2>
        <div className="mt-3">
          <BreathingPacer />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-bold text-heading">Soft sounds</h2>
        <p className="mt-1 text-xs text-muted">
          Mix your own — everything is created live on your device, so it starts instantly and works
          offline. Try the rain while you breathe.
        </p>
        <div className="mt-4">
          <SoundMixer />
        </div>
      </Card>

      <div className="px-1 text-center">
        {loggedIn ? (
          <LinkButton href="/dashboard" variant="soft">
            Back to my room
          </LinkButton>
        ) : (
          <>
            <p className="text-sm text-muted">
              Want a little room of your own — with a window that matches your mood, and a letter
              each day?
            </p>
            <LinkButton href="/signup" className="mt-3">
              Create your Happy Space
            </LinkButton>
          </>
        )}
      </div>
    </main>
  );
}
