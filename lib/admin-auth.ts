import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Minimal admin-session mechanism for the one protected action in this
 * template (replacing the profile photo): no user accounts, no database —
 * a single shared password (ADMIN_PASSWORD) gates a signed, HttpOnly cookie.
 * The HMAC key is ADMIN_PASSWORD itself, so no separate session secret is
 * needed; rotating the password also invalidates every outstanding session.
 */

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4h

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function hmac(payload: string, key: string) {
  return createHmac("sha256", key).update(payload, "utf8").digest("hex");
}

/** Constant-time string comparison via fixed-length hash digests (avoids leaking length/content through timing). */
function safeEqual(a: string, b: string) {
  const bufA = sha256(a);
  const bufB = sha256(b);
  return timingSafeEqual(bufA, bufB);
}

export function getAdminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.length > 0 ? value : null;
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

/** Builds a signed session cookie value: `<expiresAtMs>.<hmac>`. */
export function createSessionToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${hmac(payload, password)}`;
}

export function isSessionTokenValid(token: string | undefined | null): boolean {
  const password = getAdminPassword();
  if (!password || !token) return false;

  const separatorIndex = token.indexOf(".");
  if (separatorIndex === -1) return false;

  const payload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) return false;

  const expectedSignature = hmac(payload, password);
  if (signature.length !== expectedSignature.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export const ADMIN_SESSION_COOKIE = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_TTL_MS / 1000);
