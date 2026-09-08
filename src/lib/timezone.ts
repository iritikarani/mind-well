import { cookies } from "next/headers";

const DEFAULT_TIME_ZONE = "Asia/Kolkata";

/** The signed-in user's own IANA timezone, as detected client-side and stored in a cookie. */
export async function getUserTimeZone(): Promise<string> {
  const store = await cookies();
  const tz = store.get("tz")?.value;
  if (!tz) return DEFAULT_TIME_ZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}
