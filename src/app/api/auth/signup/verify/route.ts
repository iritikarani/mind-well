import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";
import { signupVerifySchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

const REASON_MESSAGES: Record<string, string> = {
  not_found: "No pending verification for this email. Please sign up again.",
  expired: "That code has expired. Please sign up again to get a new one.",
  too_many_attempts: "Too many incorrect attempts. Please sign up again.",
  invalid_code: "That code isn't right. Please try again.",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = signupVerifySchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { email, code } = parsed.data;
  const result = await verifyOtp(email, "SIGNUP", code);

  if (!result.ok) {
    return errorResponse(REASON_MESSAGES[result.reason], 422);
  }

  const { otp } = result;
  if (!otp?.pendingName || !otp.pendingUsername || !otp.pendingPasswordHash) {
    return errorResponse("This verification is missing signup details. Please sign up again.", 422);
  }

  const [emailTaken, usernameTaken] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { username: otp.pendingUsername } }),
  ]);
  if (emailTaken) return errorResponse("An account with this email already exists", 409);
  if (usernameTaken) return errorResponse("That username was just taken. Please sign up again.", 409);

  const user = await prisma.user.create({
    data: {
      email,
      name: otp.pendingName,
      username: otp.pendingUsername,
      passwordHash: otp.pendingPasswordHash,
    },
  });

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, name: user.name, username: user.username, email: user.email },
  });
}
