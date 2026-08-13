import "server-only";

import { cache } from "react";

import { getSessionTokenHash } from "@/lib/auth/session";
import { getUserBySessionTokenHash } from "@/lib/db/queries/sessions";
import type { User } from "@/db/schema";

/**
 * Resolves the current request's session cookie to a user row. Wrapped in
 * React's `cache()` so repeated calls within a single request (layout +
 * page + nested server actions) only touch the database once.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const tokenHash = await getSessionTokenHash();
  if (!tokenHash) return null;
  return getUserBySessionTokenHash(tokenHash);
});

/**
 * Same as getCurrentUser, but throws if there is no authenticated user.
 * Use in server actions / route handlers / queries that require a signed-in
 * user rather than sprinkling null checks everywhere.
 */
export async function requireCurrentUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
