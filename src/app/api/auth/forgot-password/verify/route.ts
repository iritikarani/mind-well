import { NextRequest, NextResponse } from "next/server";
import { createResetToken } from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";
import { signupVerifySchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

const REASON_MESSAGES: Record<string, string> = {
  not_found: "No pending reset for this email. Please start over.",
  expired: "That code has expired. Please request a new one.",
  too_many_attempts: "Too many incorrect attempts. Please request a new code.",
  invalid_code: "That code isn't right. Please try again.",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = signupVerifySchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { email, code } = parsed.data;
  const result = await verifyOtp(email, "PASSWORD_RESET", code);

  if (!result.ok) {
    return errorResponse(REASON_MESSAGES[result.reason], 422);
  }

  const userId = result.otp?.userId;
  if (!userId) {
    return errorResponse("Something went wrong. Please start over.", 422);
  }

  const resetToken = await createResetToken(userId, email);
  return NextResponse.json({ resetToken });
}
