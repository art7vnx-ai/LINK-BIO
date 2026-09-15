/**
 * Best-effort in-memory rate limiter for the single admin-password endpoint.
 * No database/Redis in this project (see PRODUCT.md) — this Map is scoped to
 * one serverless instance and resets on cold start, so it's a defense-in-depth
 * throttle against casual brute-forcing, not a hard guarantee. Keyed by
 * client IP; a shared "unknown" bucket still applies a global cap on the rare
 * request with no resolvable IP, which is safer than skipping the limit.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 8;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function clientIpFrom(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Returns null if the request may proceed, or the seconds to wait before retrying. */
export function checkRateLimit(key: string): number | null {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now >= entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return Math.ceil((entry.resetAt - now) / 1000);
  }

  entry.count += 1;
  return null;
}

/** Call on a successful login so a legitimate owner isn't stuck behind their own earlier typos. */
export function resetRateLimit(key: string): void {
  attempts.delete(key);
}
