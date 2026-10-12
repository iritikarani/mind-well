import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto px-6 pb-8 pt-10 text-center text-xs text-muted">
      <Link href="/about" className="hover:text-purple-text hover:underline">
        About
      </Link>
    </footer>
  );
}
