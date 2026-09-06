import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";

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

  if (!user) return errorResponse("Incorrect username/email or password", 401);

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return errorResponse("Incorrect username/email or password", 401);

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, name: user.name, username: user.username, email: user.email },
  });
}
