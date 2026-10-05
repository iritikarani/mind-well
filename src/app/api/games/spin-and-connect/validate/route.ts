import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { CATEGORIES, isValidAnswer, type CategoryKey } from "@/lib/spinConnectContent";
import { checkAnswerAgainstWikipedia } from "@/lib/wikipediaCheck";

export const maxDuration = 30;

const CATEGORY_KEYS = CATEGORIES.map((c) => c.key) as [CategoryKey, ...CategoryKey[]];

const schema = z.object({
  category: z.enum(CATEGORY_KEYS),
  letter: z.string().length(1),
  answers: z.array(z.string()).min(1).max(3),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { category, letter, answers } = parsed.data;

  const results = await Promise.all(
    answers.map(async (answer) => {
      const trimmed = answer.trim();
      if (!trimmed) return false;
      if (trimmed[0].toUpperCase() !== letter.toUpperCase()) return false;

      // The curated local word bank is the fast, always-available source of
      // truth — only fall through to a live Wikipedia lookup for an answer
      // it doesn't recognize.
      if (isValidAnswer(category, letter, trimmed)) return true;

      const check = await checkAnswerAgainstWikipedia(trimmed, category);
      // Couldn't reach/parse Wikipedia at all (including being rate-limited)
      // — give the player the benefit of the doubt rather than marking a
      // possibly-correct answer wrong for a reason outside their control.
      if (!check.checked) return true;
      return check.valid;
    }),
  );

  return NextResponse.json({ results });
}
