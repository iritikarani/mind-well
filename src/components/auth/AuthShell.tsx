import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-6 font-heading text-xl font-bold text-heading">
        🌿 Mind Well
      </Link>
      <Card className="w-full max-w-md">
        <h1 className="font-heading text-2xl font-bold text-heading">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </Card>
    </main>
  );
}
