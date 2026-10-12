# Mind Well

A quiet corner for your mind — short therapeutic games and light journaling, built with
Next.js (App Router), TypeScript, Tailwind CSS, and Prisma (SQLite).

## Getting started

```bash
npm install
cp .env.example .env   # then set SESSION_SECRET (see comment in the file)
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Email OTP (signup, forgot password)

No email provider is wired up yet. In development, verification codes are logged to the
server console and also returned in the API response, and the sign-up / forgot-password
pages surface that code directly in the UI so the flow is testable end-to-end without a
real inbox. Before shipping to production, wire up a provider (Resend, SendGrid, etc.) in
`src/lib/otp.ts` (`deliverOtp`) and stop returning `devCode` from the API routes.

## What's implemented

- **Auth** — signup with email OTP verification, login (username or email), forgot
  password with OTP + reset flow, JWT session cookies, route protection.
- **Dashboard** — badges, streaks, and game history.
- **Games**
  - Animal Runner and Three Things (journaling, with month-end PDF export) are fully
    playable.
  - World Puzzle, Color Theory, Spin and Connect, Find the Word, and Anagrams are
    scaffolded as routes with "coming soon" screens describing their planned mechanics —
    see the project spec for full details on each.

## Project structure

- `src/app` — routes (pages + API routes)
- `src/components` — UI, auth, dashboard, and per-game components
- `src/lib` — auth/session, OTP, streaks, badges, validation, shared helpers
- `prisma/schema.prisma` — data model
