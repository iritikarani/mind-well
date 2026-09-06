"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pill } from "@/components/ui/Pill";

export function AppHeader({
  name,
  streak,
}: {
  name: string;
  streak?: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 sm:px-10">
      <Link href="/dashboard" className="font-heading text-lg font-bold text-heading">
        🌿 Mind Well
      </Link>
      <div className="flex items-center gap-3">
        {typeof streak === "number" && streak > 0 && (
          <Pill tone="butter">🔥 {streak}-day streak</Pill>
        )}
        <span className="hidden text-sm font-medium text-muted sm:inline">Hi, {name}</span>
        <button
          onClick={logout}
          disabled={loading}
          className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-heading hover:bg-white disabled:opacity-50"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
