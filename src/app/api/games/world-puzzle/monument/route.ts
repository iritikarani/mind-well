import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-response";
import { MONUMENTS } from "@/lib/worldPuzzleContent";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const plays = await prisma.gamePlay.findMany({
    where: { userId: user.id, game: "WORLD_PUZZLE" },
    select: { result: true },
  });

  const completedIds = new Set<string>();
  for (const play of plays) {
    try {
      const parsed = JSON.parse(play.result) as { monumentId?: string };
      if (parsed.monumentId) completedIds.add(parsed.monumentId);
    } catch {
      // ignore malformed rows
    }
  }

  const remaining = MONUMENTS.filter((m) => !completedIds.has(m.id));
  const pool = remaining.length > 0 ? remaining : MONUMENTS;
  const monument = pool[Math.floor(Math.random() * pool.length)];

  return NextResponse.json({ monumentId: monument.id });
}
