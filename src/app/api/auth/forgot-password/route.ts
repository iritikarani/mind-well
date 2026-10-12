import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetOtp } from "@/lib/otp";
import { OtpRateLimitError } from "@/lib/throttle";
import { forgotPasswordSchema } from "@/lib/validation";
import { zodErrorResponse, isDev } from "@/lib/api-response";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond the same way so we don't leak which emails have accounts.
  const genericMessage = "If that email has an account, we sent a verification code.";

  if (!user) {
    return NextResponse.json({ message: genericMessage });
  }

  let devCode: string;
  try {
    ({ devCode } = await createPasswordResetOtp({ email, userId: user.id }));
  } catch (err) {
    // Same answer as "no such account" so the limit can't be used to probe
    // which addresses are registered.
    if (err instanceof OtpRateLimitError) return NextResponse.json({ message: genericMessage });
    throw err;
  }

  return NextResponse.json({
    message: genericMessage,
    ...(isDev ? { devCode } : {}),
  });
}
