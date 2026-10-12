"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { GENERIC_ERROR_MESSAGE, describeFetchError } from "@/lib/errorMessages";

export function DeleteAccountForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? GENERIC_ERROR_MESSAGE);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(describeFetchError(err));
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Delete my account…
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="text-sm text-heading">
        This permanently deletes your profile, moods, journal, game history, badges and streak. It
        can&apos;t be undone. Enter your password to confirm.
      </p>
      <div>
        <Label htmlFor="delete-password">Password</Label>
        <Input
          id="delete-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby={error ? "delete-error" : undefined}
          required
        />
        <FieldError id="delete-error">{error}</FieldError>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading || password.length === 0} className="bg-rose-500 hover:brightness-105">
          {loading ? "Deleting…" : "Yes, delete everything"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Keep my account
        </Button>
      </div>
    </form>
  );
}
