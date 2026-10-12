import type { Metadata } from "next";
import { LegalShell, H2 } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Happy Space stores about you, why, who else sees it, and how to take it or delete it.",
};

const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy" updated="October 2026">
      <p>
        Happy Space holds some of the most personal things a person can write — how you feel and what
        you&apos;re grateful for. So this page is plain and specific about what we keep.
      </p>

      <H2>What we store</H2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Your name, username and email address, and a scrambled (hashed) version of your password — never the password itself.</li>
        <li>Your mood check-ins, one per day.</li>
        <li>The three-things journal entries you write.</li>
        <li>Your game results, badges and streak.</li>
        <li>A small cookie that keeps you signed in, and your time zone so your &ldquo;day&rdquo; changes at your own midnight.</li>
      </ul>
      <p>
        Journal text and moods are stored in our database as readable text. They are protected by your
        login, but they are not end-to-end encrypted, so please don&apos;t write anything you wouldn&apos;t be
        comfortable storing in a normal online account.
      </p>

      <H2>What we don&apos;t do</H2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>We don&apos;t sell or rent your data, and we show no ads.</li>
        <li>We don&apos;t use advertising or tracking cookies, and we don&apos;t run analytics on what you write.</li>
        <li>We don&apos;t read your journal or moods, and they are never shown to other people.</li>
      </ul>

      <H2>Who else is involved</H2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li><strong>Hosting and database</strong> providers store the data above on our behalf.</li>
        <li><strong>An email service (Brevo)</strong> delivers your verification codes. It receives your email address and the code.</li>
        <li><strong>Wikipedia</strong> is asked, in Spin &amp; Connect, whether an answer you typed is a real item in a category. Only the typed word and the category are sent — nothing that identifies you.</li>
      </ul>

      <H2>Your choices</H2>
      <p>
        From <strong>Settings</strong> you can download everything we hold about you as a file, or delete
        your account. Deleting is permanent and removes your profile, moods, journal, game history, badges
        and streak.
      </p>

      <H2>Keeping it safe</H2>
      <p>
        Connections are encrypted, passwords are hashed, sign-in is rate-limited, and verification codes
        expire after ten minutes. No system is perfectly secure, and we&apos;ll tell you if something
        affecting your data ever goes wrong.
      </p>

      <H2>Questions</H2>
      <p>
        {contact ? (
          <>
            Write to us at{" "}
            <a className="font-semibold underline underline-offset-2" href={`mailto:${contact}`}>
              {contact}
            </a>
            .
          </>
        ) : (
          <>Reply to any email we&apos;ve sent you and it will reach us.</>
        )}
      </p>
    </LegalShell>
  );
}
