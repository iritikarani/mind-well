export const NETWORK_ERROR_MESSAGE =
  "The little clouds are blocking the connection. Try again in a moment. ☁️";

export const GENERIC_ERROR_MESSAGE = "Oops! Something doesn't look right. Try again ♡";

/**
 * `fetch()` rejects with a `TypeError` when the request never reaches a
 * server (offline, DNS, CORS) — an HTTP error response resolves normally
 * and is handled separately via `res.ok`. Used in catch blocks so a real
 * connectivity problem shows a friendly, specific message instead of the
 * raw "Failed to fetch" string.
 */
export function describeFetchError(err: unknown): string {
  if (err instanceof TypeError) return NETWORK_ERROR_MESSAGE;
  if (err instanceof Error && err.message) return err.message;
  return GENERIC_ERROR_MESSAGE;
}
