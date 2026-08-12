import "server-only";

import { cache } from "react";
import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users, type User } from "@/db/schema";

/**
 * Resolves the authenticated Clerk session to an After Party user row,
 * creating it on first access. Never trust a user id supplied by the
 * client — this is the only source of truth for "who is making this
 * request", and every ownership check in the app should be built on top
 * of it.
 *
 * Wrapped in React's `cache()` so repeated calls within a single request
 * (layout + page + nested server actions) only touch the database once.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  if (existing) return existing;

  const clerkUser = await getClerkUser();

  const [created] = await db
    .insert(users)
    .values({
      clerkUserId,
      name: clerkUser
        ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          null
        : null,
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? null,
      avatarUrl: clerkUser?.imageUrl ?? null,
    })
    // Guards against a race where two requests both miss the SELECT above
    // and try to create the same user concurrently.
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: { updatedAt: new Date() },
    })
    .returning();

  return created;
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
