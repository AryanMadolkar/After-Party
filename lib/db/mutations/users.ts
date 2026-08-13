import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { oauthAccounts, users, type OAuthProvider, type User } from "@/db/schema";

export async function createUserWithPassword(input: {
  email: string;
  passwordHash: string;
  name?: string | null;
}): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      name: input.name ?? null,
    })
    .returning();
  return user;
}

export async function createUserFromOAuth(input: {
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  emailVerified: boolean;
}): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      email: input.email.toLowerCase(),
      name: input.name ?? null,
      avatarUrl: input.avatarUrl ?? null,
      emailVerifiedAt: input.emailVerified ? new Date() : null,
    })
    .returning();
  return user;
}

export async function linkOAuthAccount(input: {
  userId: string;
  provider: OAuthProvider;
  providerAccountId: string;
}): Promise<void> {
  await db
    .insert(oauthAccounts)
    .values(input)
    .onConflictDoNothing({ target: [oauthAccounts.provider, oauthAccounts.providerAccountId] });
}

export async function updateUserPassword(userId: string, passwordHash: string): Promise<void> {
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId));
}
