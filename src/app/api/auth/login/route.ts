import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { attemptPassword, lockedMessage } from "@/lib/passwordCheck";

export const maxDuration = 30;

// A real bcrypt hash of a throwaway string. Checked when no account matches,
// so "no such user" costs the same time as "wrong password" and response
// timing can't be used to find out which usernames exist.
const DUMMY_HASH = "$2b$10$SA3jR/gIlBn53dhdrl3TGe1OlUNlMbevlaaGoN8nn0ng/VvyYUfU6";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return zodErrorResponse(parsed.error);

  const { identifier, password } = parsed.data;
  const normalized = identifier.trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalized.toLowerCase() },
        { username: normalized },
      ],
    },
  });

  if (!user) {
    await verifyPassword(password, DUMMY_HASH);
    return errorResponse("Incorrect username/email or password", 401);
  }

  const attempt = await attemptPassword(user, password);
  if (attempt.result === "locked") {
    const res = errorResponse(lockedMessage(attempt.minutes), 429);
    res.headers.set("Retry-After", String(attempt.minutes * 60));
    return res;
  }
  if (attempt.result === "wrong") {
    return errorResponse("Incorrect username/email or password", 401);
  }

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, name: user.name, username: user.username, email: user.email },
  });
}
