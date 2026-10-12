import Link from "next/link";
import { PixelHeart } from "@/components/pixel/PixelArt";
import { Card } from "@/components/ui/Card";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-6 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 font-heading text-lg font-bold text-heading"
      >
        <PixelHeart size={20} />
        Happy Space
      </Link>
      <Card className="p-6 sm:p-8">
        <h1 className="font-heading text-3xl font-bold text-heading">{title}</h1>
        {updated && <p className="mt-1 text-xs text-muted">Last updated {updated}</p>}
        <div className="legal-prose mt-6 space-y-4 text-[15px] leading-relaxed text-heading/90">
          {children}
        </div>
      </Card>
    </main>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="!mt-8 font-heading text-xl font-bold text-heading">{children}</h2>;
}
