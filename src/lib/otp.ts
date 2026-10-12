import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import type { OtpPurpose } from "@/generated/prisma/enums";
import { OTP_SENDS_PER_HOUR, OtpRateLimitError } from "@/lib/throttle";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function generateCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

const OTP_SUBJECT: Record<OtpPurpose, string> = {
  SIGNUP: "Your Happy Space verification code",
  PASSWORD_RESET: "Reset your Happy Space password",
};

const OTP_INTRO: Record<OtpPurpose, string> = {
  SIGNUP: "Use this code to finish creating your Happy Space account:",
  PASSWORD_RESET: "Use this code to reset your Happy Space password:",
};

/** Sends the OTP by email via Brevo's transactional email API. */
async function deliverOtp(email: string, code: string, purpose: OtpPurpose) {
  // Never log codes in production — logs are not a safe place for credentials.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[OTP] ${purpose} code for ${email}: ${code}`);
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) {
    throw new Error("Email provider is not configured (BREVO_API_KEY / BREVO_SENDER_EMAIL missing)");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Happy Space", email: senderEmail },
      to: [{ email }],
      subject: OTP_SUBJECT[purpose],
      htmlContent: `
        <p>${OTP_INTRO[purpose]}</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
        <p>This code expires in ${OTP_TTL_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo send failed (${res.status}): ${body}`);
  }
}

/** Caps how many codes one address can be sent per hour — stops email
 * flooding, quota burn, and unlimited guess attempts via re-requests. */
async function assertCanSendOtp(email: string) {
  const recent = await prisma.otpCode.count({
    where: { email, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
  });
  if (recent >= OTP_SENDS_PER_HOUR) throw new OtpRateLimitError();
}

export async function createSignupOtp(params: {
  email: string;
  pendingName: string;
  pendingUsername: string;
  pendingPasswordHash: string;
}) {
  await assertCanSendOtp(params.email);
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

  await deliverOtp(params.email, code, "SIGNUP");
  return { otpId: otp.id, devCode: code };
}

export async function createPasswordResetOtp(params: {
  email: string;
  userId: string;
}) {
  await assertCanSendOtp(params.email);
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

  await deliverOtp(params.email, code, "PASSWORD_RESET");
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
