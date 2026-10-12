/** The public address of the site, used for link previews, the sitemap and
 * the app manifest. Set NEXT_PUBLIC_SITE_URL to override (e.g. a custom
 * domain); otherwise Vercel's production URL, then the known live address. */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://mind-well-nine.vercel.app");

export const SITE_NAME = "Happy Space";
export const SITE_TAGLINE = "A small place to feel a little lighter";
export const SITE_DESCRIPTION =
  "A cozy little room that matches your mood — plus a daily letter, a calm corner with breathing and soft sounds, and gentle games for your mental wellbeing.";
