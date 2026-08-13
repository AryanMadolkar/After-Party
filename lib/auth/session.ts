import "server-only";

import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";

import { createSessionRow, deleteSessionByTokenHash } from "@/lib/db/mutations/sessions";

export const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a session row and sets the session cookie. Only the token's
 * SHA-256 hash is persisted — the raw token exists only in the browser's
 * cookie and this one return value, so a database read alone can never
 * produce a usable session.
 */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await createSessionRow({ userId, tokenHash: hashToken(token), expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Reads the session cookie's hash without touching the database. Used by middleware for a cheap, DB-free "is there a session at all" check. */
export async function getSessionTokenHash(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return token ? hashToken(token) : null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSessionByTokenHash(hashToken(token));
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}
