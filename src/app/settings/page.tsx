import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getEffectiveStreak } from "@/lib/streak";
import { AppHeader } from "@/components/app/AppHeader";
import { DeleteAccountForm } from "@/components/app/DeleteAccountForm";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const streak = await getEffectiveStreak(user.id);

  return (
    <>
      <AppHeader name={user.name} streak={streak.currentCount} />
      <main className="mx-auto w-full max-w-2xl flex-1 space-y-5 px-4 pb-16 sm:px-6">
        <h1 className="font-heading text-3xl font-bold text-heading">Settings</h1>

        <Card>
          <h2 className="font-heading text-lg font-bold text-heading">Your account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Name</dt>
              <dd className="font-semibold text-heading">{user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Username</dt>
              <dd className="font-semibold text-heading">{user.username}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Email</dt>
              <dd className="break-all font-semibold text-heading">{user.email}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="font-heading text-lg font-bold text-heading">Your data</h2>
          <p className="mt-1 text-sm text-muted">
            Download everything Happy Space holds about you — moods, journal, game history and badges —
            as one file. It&apos;s yours to keep.
          </p>
          <a
            href="/api/me/export"
            download
            className="pixel-panel pixel-pressable mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-lavender-strong px-6 py-3 font-heading text-sm font-semibold text-lavender-text hover:brightness-105"
          >
            Download my data
          </a>
        </Card>

        <Card>
          <h2 className="font-heading text-lg font-bold text-heading">Delete account</h2>
          <div className="mt-3">
            <DeleteAccountForm />
          </div>
        </Card>

      </main>
    </>
  );
}
