import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { destroySession, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { attemptPassword, lockedMessage } from "@/lib/passwordCheck";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

export const maxDuration = 30;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    user: { id: user.id, name: user.name, username: user.username, email: user.email },
  });
}

const deleteSchema = z.object({ password: z.string().min(1, "Enter your password to confirm") });

/** Permanently deletes the signed-in account and everything attached to it
 * (plays, badges, journal, moods, streak — all cascade from the user row).
 * Requires the password again so a left-open session can't erase an account. */
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Not signed in", 401);

  const body = await req.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const attempt = await attemptPassword(user, parsed.data.password);
  if (attempt.result === "locked") return errorResponse(lockedMessage(attempt.minutes), 429);
  if (attempt.result === "wrong") return errorResponse("That password isn't right", 401);

  await prisma.$transaction([
    prisma.otpCode.deleteMany({ where: { email: user.email } }),
    prisma.user.delete({ where: { id: user.id } }),
  ]);
  await destroySession();

  return NextResponse.json({ ok: true });
}
