import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import type { OtpPurpose } from "@/generated/prisma/enums";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function generateCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/**
 * Sends an OTP. No email provider is wired up yet, so the code is logged to
 * the server console; callers may also surface it in dev-only UI/response
 * fields until a real provider (Resend, SendGrid, etc.) is configured.
 */
function deliverOtp(email: string, code: string, purpose: OtpPurpose) {
  console.log(`[OTP] ${purpose} code for ${email}: ${code}`);
}

export async function createSignupOtp(params: {
  email: string;
  pendingName: string;
  pendingUsername: string;
  pendingPasswordHash: string;
}) {
  await prisma.otpCode.updateMany({
    where: { email: params.email, purpose: "SIGNUP", consumed: false },
    data: { consumed: true },
  });

  const code = generateCode();
  const otp = await prisma.otpCode.create({
    data: {
      email: params.email,
      codeHash: hashCode(code),
      purpose: "SIGNUP",
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
      pendingName: params.pendingName,
      pendingUsername: params.pendingUsername,
      pendingPasswordHash: params.pendingPasswordHash,
    },
  });

  deliverOtp(params.email, code, "SIGNUP");
  return { otpId: otp.id, devCode: code };
}

export async function createPasswordResetOtp(params: {
  email: string;
  userId: string;
}) {
  await prisma.otpCode.updateMany({
    where: { email: params.email, purpose: "PASSWORD_RESET", consumed: false },
    data: { consumed: true },
  });

  const code = generateCode();
  const otp = await prisma.otpCode.create({
    data: {
      email: params.email,
      codeHash: hashCode(code),
      purpose: "PASSWORD_RESET",
      userId: params.userId,
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
    },
  });

  deliverOtp(params.email, code, "PASSWORD_RESET");
  return { otpId: otp.id, devCode: code };
}

type VerifyResult =
  | { ok: true; otp: Awaited<ReturnType<typeof prisma.otpCode.findFirst>> }
  | { ok: false; reason: "not_found" | "expired" | "too_many_attempts" | "invalid_code" };

export async function verifyOtp(
  email: string,
  purpose: OtpPurpose,
  code: string,
): Promise<VerifyResult> {
  const otp = await prisma.otpCode.findFirst({
    where: { email, purpose, consumed: false },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return { ok: false, reason: "not_found" };
  if (otp.expiresAt < new Date()) return { ok: false, reason: "expired" };
  if (otp.attempts >= MAX_ATTEMPTS) {
    return { ok: false, reason: "too_many_attempts" };
  }

  if (otp.codeHash !== hashCode(code)) {
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "invalid_code" };
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { consumed: true },
  });

  return { ok: true, otp };
}
