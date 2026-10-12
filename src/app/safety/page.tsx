import type { Metadata } from "next";
import { LegalShell, H2 } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Support & safety",
  description: "If you're struggling, here is who you can reach right now.",
};

const lines = [
  { place: "India", name: "Tele-MANAS (free, 24/7)", contact: "14416 or 1800-891-4416" },
  { place: "India", name: "KIRAN mental health helpline", contact: "1800-599-0019" },
  { place: "United States", name: "988 Suicide & Crisis Lifeline", contact: "Call or text 988" },
  { place: "UK & Ireland", name: "Samaritans", contact: "116 123" },
];

export default function SafetyPage() {
  return (
    <LegalShell title="Support & safety">
      <p>
        Happy Space can be a soft place to land, but it isn&apos;t a substitute for a person who can help.
        If things feel heavy, you deserve real support — and reaching out is a strong thing to do.
      </p>

      <div
        role="note"
        className="rounded-2xl bg-blush px-4 py-3 font-semibold text-blush-text"
      >
        If you are in immediate danger or thinking about ending your life, call your local emergency
        number now.
      </div>

      <H2>Someone to talk to</H2>
      <ul className="space-y-3">
        {lines.map((l) => (
          <li key={l.name} className="rounded-2xl bg-lavender/50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{l.place}</p>
            <p className="font-heading font-semibold text-heading">{l.name}</p>
            <p className="text-lg font-bold text-purple-text">{l.contact}</p>
          </li>
        ))}
      </ul>
      <p>
        Somewhere else? The directory at{" "}
        <a
          className="font-semibold underline underline-offset-2"
          href="https://findahelpline.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          findahelpline.com
        </a>{" "}
        lists free helplines in almost every country.
      </p>

      <H2>Small things that can help right now</H2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Slow your breathing — try the breathing pacer in the Calm corner.</li>
        <li>Tell one person you trust how you&apos;re really feeling.</li>
        <li>Put some distance between you and anything that could hurt you.</li>
      </ul>
    </LegalShell>
  );
}
