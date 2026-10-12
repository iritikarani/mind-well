import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { afterFailedLogin, isLocked, minutesUntil } from "@/lib/throttle";

type CheckableUser = {
  id: string;
  passwordHash: string;
  failedLoginCount: number;
  lockedUntil: Date | null;
};

export type PasswordAttempt =
  | { result: "ok" }
  | { result: "wrong" }
  | { result: "locked"; minutes: number };

/** Verifies a password while enforcing the shared lockout: five wrong
 * guesses lock the account for 15 minutes, a correct one clears the count. */
export async function attemptPassword(
  user: CheckableUser,
  password: string,
): Promise<PasswordAttempt> {
  if (isLocked(user.lockedUntil)) {
    return { result: "locked", minutes: minutesUntil(user.lockedUntil!) };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await prisma.user.update({
      where: { id: user.id },
      data: afterFailedLogin(user.failedLoginCount),
    });
    return { result: "wrong" };
  }

  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: null },
    });
  }
  return { result: "ok" };
}

export function lockedMessage(minutes: number) {
  return `Too many attempts. Take a breath and try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}
