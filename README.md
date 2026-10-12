# Happy Space

A small, cozy place for your mental wellbeing — a room that matches your mood, a letter
each day, a calm corner for breathing and soft sounds, and gentle games. Built with
Next.js (App Router), TypeScript, Tailwind CSS and Prisma on PostgreSQL.

## What's inside

- **Your Space** (`/dashboard`) — a living illustrated room. The window shows the weather
  of how you said you feel (cozy rain on hard days, sun on bright ones) and follows the
  real time of day; your postcards, badges and journal sit in the room, a plant grows with
  every game, and the mailbox delivers one letter a day.
- **Daily letter** — 30 hand-written letters, tender or light depending on your mood, with an
  optional repeating calendar reminder (`.ics`, no push permissions needed).
- **Calm corner** (`/calm`, public) — a breathing pacer and a mixer of live-generated
  sounds (rain, waves, fire, wind, hum, chimes) with a sleep timer. No audio files.
- **Games** — Basket Buddies, Postcard Puzzles (postcards → My World), Hue Hugs,
  Whimsy Wheels (answers checked against our word bank, then Wikipedia), Word Nest,
  Alphabet Soup, and Tiny Treasures (journal).
- **Badges, streaks, mood check-ins, shareable badge/postcard images.**
- **Trust** — privacy, terms and a support & safety page; Settings lets you download all
  your data or delete your account; login lockout and email throttling.

## Getting started

```bash
npm install
cp .env.example .env     # then fill in the values below
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Pooled Postgres connection used by the app at runtime |
| `DIRECT_URL` | Direct (non-pooled) connection used by Prisma migrations |
| `SESSION_SECRET` | Signing session cookies — use a long random string |
| `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` | Sending sign-up / password-reset codes |
| `NEXT_PUBLIC_SITE_URL` | Optional — public address for link previews and the sitemap (defaults to the Vercel production URL) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional — shown on the privacy page as the contact address |

In development, one-time codes are logged to the server console and returned by the API so
the flow can be tested without an inbox. They are never logged or returned in production.

## Scripts

```bash
npm run dev       # develop
npm test          # unit tests (vitest)
npm run lint
npx tsc --noEmit  # type check
npm run build     # runs database migrations, then builds (used on deploy)
node scripts/optimize-monuments.mjs   # recompress monument photos + make thumbnails
node scripts/make-icons.mjs           # regenerate app icons from src/app/icon.svg
```

CI (`.github/workflows/ci.yml`) runs the type check, lint, tests and a build on every push.

## Notes

- Safety numbers on `/safety` (Tele-MANAS, KIRAN, 988, Samaritans) should be re-verified for
  your audience before launch.
- The privacy page and terms are plain-language drafts, not legal advice.
