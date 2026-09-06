import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSignupOtp } from "@/lib/otp";
import { signupSchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse, isDev } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { email, name, username, password } = parsed.data;

  const [emailTaken, usernameTaken] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.user.findUnique({ where: { username } }),
  ]);

  if (emailTaken) return errorResponse("An account with this email already exists", 409);
  if (usernameTaken) return errorResponse("That username is taken", 409);

  const passwordHash = await hashPassword(password);
  const { devCode } = await createSignupOtp({
    email,
    pendingName: name,
    pendingUsername: username,
    pendingPasswordHash: passwordHash,
  });

  return NextResponse.json({
    message: "We sent a verification code to your email.",
    email,
    ...(isDev ? { devCode } : {}),
  });
}
