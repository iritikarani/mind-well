import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { findTheWordQuestionSchema } from "@/lib/validation";
import { pickVariantIndex, wordByName } from "@/lib/findTheWordContent";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = findTheWordQuestionSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const def = wordByName(parsed.data.word);
  if (!def) return errorResponse("Unknown word", 422);

  const pastPlays = await prisma.gamePlay.findMany({
    where: { userId: user.id, game: "FIND_THE_WORD" },
    orderBy: { playedAt: "desc" },
    select: { result: true },
  });

  let lastIndex: number | null = null;
  for (const play of pastPlays) {
    if (lastIndex !== null) break;
    try {
      const parsedResult = JSON.parse(play.result) as {
        wordsFound?: { word: string; variantIndex: number }[];
      };
      const match = (parsedResult.wordsFound ?? []).find((entry) => entry.word === def.word);
      if (match) lastIndex = match.variantIndex;
    } catch {
      // ignore malformed rows
    }
  }

  const variantIndex = pickVariantIndex(def.word, lastIndex);
  const variant = def.questions[variantIndex];

  return NextResponse.json({ variantIndex, variant });
}
