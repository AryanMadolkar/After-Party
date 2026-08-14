import "server-only";

import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";

const STATE_COOKIE = "oauth_state";
const VERIFIER_COOKIE = "oauth_verifier";
const OAUTH_COOKIE_MAX_AGE_SECONDS = 10 * 60; // 10 minutes — just long enough for the redirect round trip

export type PkcePair = { verifier: string; challenge: string };

export function generatePkce(): PkcePair {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function generateState(): string {
  return randomBytes(16).toString("base64url");
}

/**
 * Stores the CSRF `state` and PKCE `verifier` for the round trip to
 * Google and back. `Lax` is sufficient since Google's callback is a
 * same-site-safe top-level GET redirect.
 */
export async function setOAuthCookies(state: string, verifier: string): Promise<void> {
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
  };
  cookieStore.set(STATE_COOKIE, state, options);
  cookieStore.set(VERIFIER_COOKIE, verifier, options);
}

export async function consumeOAuthCookies(): Promise<{ state: string | null; verifier: string | null }> {
  const cookieStore = await cookies();
  const state = cookieStore.get(STATE_COOKIE)?.value ?? null;
  const verifier = cookieStore.get(VERIFIER_COOKIE)?.value ?? null;
  cookieStore.delete(STATE_COOKIE);
  cookieStore.delete(VERIFIER_COOKIE);
  return { state, verifier };
}
