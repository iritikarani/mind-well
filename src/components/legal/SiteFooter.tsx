import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto px-6 pb-8 pt-10 text-center text-xs text-muted">
      <p className="mx-auto max-w-md">
        Happy Space is a gentle self-care companion — not therapy, diagnosis or medical advice.
        If you&apos;re struggling, please reach out to someone you trust or{" "}
        <Link href="/safety" className="font-semibold underline underline-offset-2">
          find support here
        </Link>
        .
      </p>
      <nav aria-label="Footer" className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
        <Link href="/privacy" className="hover:text-purple-text hover:underline">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-purple-text hover:underline">
          Terms
        </Link>
        <Link href="/safety" className="hover:text-purple-text hover:underline">
          Support &amp; safety
        </Link>
      </nav>
      <p className="mt-3">© {new Date().getFullYear()} Happy Space ♡</p>
    </footer>
  );
}
