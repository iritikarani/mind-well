import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api-response";

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const month = req.nextUrl.searchParams.get("month"); // YYYY-MM
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return errorResponse("A valid month is required", 422);
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: user.id, date: { startsWith: month } },
    orderBy: [{ date: "asc" }, { slot: "asc" }],
  });

  const byDate: Record<string, { slot: number; text: string }[]> = {};
  for (const e of entries) {
    byDate[e.date] ??= [];
    byDate[e.date].push({ slot: e.slot, text: e.text });
  }

  return NextResponse.json({ entries: byDate });
}
