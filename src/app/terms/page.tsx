import type { Metadata } from "next";
import { LegalShell, H2 } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms",
  description: "The simple ground rules for using Happy Space.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms" updated="October 2026">
      <p>By creating an account or using Happy Space you agree to these simple terms.</p>

      <H2>What Happy Space is</H2>
      <p>
        A small, gentle place to relax, play and reflect. It is a self-care companion. It is{" "}
        <strong>not</strong> therapy, counselling, a diagnosis or medical advice, and it can&apos;t replace a
        professional. If you are in crisis or in danger, please use the{" "}
        <a className="font-semibold underline underline-offset-2" href="/safety">
          support options here
        </a>{" "}
        or contact your local emergency number.
      </p>

      <H2>Your account</H2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Give a real email address you can access, and keep your password to yourself.</li>
        <li>You&apos;re responsible for what happens under your account.</li>
        <li>You can delete your account at any time from Settings.</li>
      </ul>

      <H2>Be kind and be fair</H2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Don&apos;t try to break, overload or get around the service, or access anyone else&apos;s account.</li>
        <li>Don&apos;t use automated tools to play or to create accounts.</li>
      </ul>

      <H2>Your content</H2>
      <p>
        What you write in your journal belongs to you. You let us store it so the app can show it back to
        you — nothing more.
      </p>

      <H2>The service</H2>
      <p>
        Happy Space is provided as it is, without guarantees. Features, content and daily limits may change,
        and we may occasionally be unavailable. To the extent the law allows, we aren&apos;t liable for losses
        that come from using — or not being able to use — the service.
      </p>

      <H2>Changes</H2>
      <p>If these terms change in an important way, we&apos;ll say so in the app. Continuing to use Happy Space means you accept the update.</p>
    </LegalShell>
  );
}
