import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import {
  LEVEL1_PUZZLES,
  LEVEL2_PUZZLES,
  LEVEL3_PUZZLES,
  pickNextPuzzle,
} from "@/lib/anagramsContent";

export const maxDuration = 30;

function recentSourcesFor(
  plays: { sources?: { level1: string; level2: string; level3: string } }[],
  level: "level1" | "level2" | "level3",
): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const play of plays) {
    const source = play.sources?.[level];
    if (source && !seen.has(source)) {
      seen.add(source);
      ordered.push(source);
    }
  }
  return ordered;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const plays = await prisma.gamePlay.findMany({
    where: { userId: user.id, game: "ANAGRAMS" },
    orderBy: { playedAt: "desc" },
    take: 30,
    select: { result: true },
  });

  const parsed = plays
    .map((p) => {
      try {
        return JSON.parse(p.result) as { sources?: { level1: string; level2: string; level3: string } };
      } catch {
        return null;
      }
    })
    .filter((r): r is { sources?: { level1: string; level2: string; level3: string } } => r !== null);

  const puzzle1 = pickNextPuzzle(LEVEL1_PUZZLES, recentSourcesFor(parsed, "level1"));
  const puzzle2 = pickNextPuzzle(LEVEL2_PUZZLES, recentSourcesFor(parsed, "level2"));
  const puzzle3 = pickNextPuzzle(LEVEL3_PUZZLES, recentSourcesFor(parsed, "level3"));

  return NextResponse.json({
    level1: puzzle1.source,
    level2: puzzle2.source,
    level3: puzzle3.source,
  });
}
