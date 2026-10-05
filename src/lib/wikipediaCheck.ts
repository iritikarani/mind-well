import type { CategoryKey } from "./spinConnectContent";

/**
 * A short search term appended to the player's answer (e.g. "Haberdasher
 * occupation") before searching Wikipedia. Combining the two is far more
 * reliable than fetching the answer's own article and checking its text:
 * plenty of real, correct answers ("Cooper", a job) are also common
 * surnames or place names on Wikipedia, so the article you'd land on by
 * title alone is often about something else entirely. Searching with the
 * category term attached surfaces the right sense directly.
 */
const CATEGORY_SEARCH_TERMS: Record<CategoryKey, string> = {
  fruits: "fruit",
  vegetables: "vegetable",
  flowers: "flower",
  colors: "color",
  animals: "animal",
  birds: "bird",
  countries: "country",
  sports: "sport",
  movies: "film",
  jobs: "occupation",
  school_subjects: "academic subject",
  emotions: "emotion",
  clothing: "clothing",
  household: "household item",
};

/**
 * Wikipedia disambiguates exactly the collision this game runs into a lot —
 * a word that's also a common surname, place, or title — with a
 * parenthetical suffix (e.g. "Cooper (profession)" for the barrel-making
 * trade, distinct from the hundreds of notable people named Cooper).
 * Trying these as direct title lookups first catches that cleanly; not
 * every category has a reliable one, so this is a best-effort shortlist,
 * not a replacement for the search fallback below.
 */
const CATEGORY_DISAMBIGUATORS: Partial<Record<CategoryKey, string[]>> = {
  fruits: ["fruit"],
  vegetables: ["vegetable"],
  flowers: ["flower", "plant"],
  animals: ["animal"],
  birds: ["bird"],
  sports: ["sport"],
  movies: ["film"],
  jobs: ["profession", "occupation"],
  school_subjects: ["academic discipline", "subject"],
  emotions: ["emotion"],
  clothing: ["clothing"],
};

// Required by the Wikimedia API etiquette (identifies the app instead of
// looking like anonymous/abusive traffic) — see
// https://meta.wikimedia.org/wiki/User-Agent_policy. Doesn't guarantee
// requests won't be rate-limited; see the "unreachable" handling below,
// which was shaped by hitting that limit directly during development.
const USER_AGENT = "HappySpaceApp/1.0 (https://mind-well-nine.vercel.app/) spin-and-connect-check";
const FETCH_TIMEOUT_MS = 4000;

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/, "") // drop a trailing " (disambiguator)"
    .replace(/[^a-z0-9]/g, "");
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prevRow = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const currentRow = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currentRow[j] = Math.min(currentRow[j - 1] + 1, prevRow[j] + 1, prevRow[j - 1] + cost);
    }
    prevRow = currentRow;
  }
  return prevRow[b.length];
}

function titleMatchesAnswer(answer: string, title: string): boolean {
  const a = normalizeTitle(answer);
  const t = normalizeTitle(title);
  if (!a || !t) return false;
  if (a === t) return true;
  const maxDistance = a.length <= 4 ? 1 : 2;
  return levenshtein(a, t) <= maxDistance;
}

type DirectLookup = "found" | "not_found" | "error";

/** A single exact-title lookup against the summary API, collapsed to just
 * the three outcomes the caller below needs. */
async function lookupTitle(title: string): Promise<DirectLookup> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
    );
    if (res.status === 404) return "not_found";
    if (!res.ok) return "error";
    const data = await res.json();
    if (data.type === "disambiguation") return "not_found";
    return "found";
  } catch {
    return "error";
  }
}

export interface WikipediaCheckResult {
  valid: boolean;
  /** False when Wikipedia couldn't be reached or parsed at all (including
   * being rate-limited — the public API can return HTTP 200 with a plain
   * text rate-limit notice instead of JSON, confirmed directly while
   * building this, so a JSON parse failure is treated the same as a
   * network error). Callers should treat `checked: false` as "couldn't
   * verify" and give the player the benefit of the doubt, rather than
   * penalizing them for Wikipedia being temporarily unavailable. */
  checked: boolean;
}

/** Checks whether `answer` names something Wikipedia itself associates with
 * the given category, via a combined full-text search rather than trusting
 * the answer's own article (see CATEGORY_SEARCH_TERMS above for why). Used
 * only as a fallback for answers the curated local word bank in
 * spinConnectContent.ts doesn't already recognize — that list stays the
 * primary, instant, always-available source of truth; this just widens
 * what counts as a valid answer beyond it. */
export async function checkAnswerAgainstWikipedia(
  answer: string,
  category: CategoryKey,
): Promise<WikipediaCheckResult> {
  const trimmed = answer.trim();
  if (!trimmed) return { valid: false, checked: true };

  let sawNetworkError = false;

  for (const disambiguator of CATEGORY_DISAMBIGUATORS[category] ?? []) {
    const outcome = await lookupTitle(`${trimmed} (${disambiguator})`);
    if (outcome === "found") return { valid: true, checked: true };
    if (outcome === "error") sawNetworkError = true;
  }

  const term = CATEGORY_SEARCH_TERMS[category] ?? category;
  const query = `${trimmed} ${term}`;

  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5`,
      { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
    );
    if (!res.ok) return { valid: false, checked: false };

    const data = await res.json();
    const results: { title: string }[] = data?.query?.search ?? [];
    const valid = results.some((r) => titleMatchesAnswer(trimmed, r.title));
    // A clean, parsed search response with no match is a confident "no" —
    // unless an earlier disambiguator lookup hit a real network error, in
    // which case we can't fully trust this round either way, so lean
    // lenient rather than risk penalizing the player for our own hiccup.
    if (!valid && sawNetworkError) return { valid: false, checked: false };
    return { valid, checked: true };
  } catch {
    return { valid: false, checked: false };
  }
}
