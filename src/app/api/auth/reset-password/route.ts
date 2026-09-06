import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword, verifyResetToken } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { resetToken, password } = parsed.data;
  const claims = await verifyResetToken(resetToken);
  if (!claims) {
    return errorResponse("This reset link has expired. Please start over.", 401);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.update({
    where: { id: claims.userId },
    data: { passwordHash },
  });

  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
