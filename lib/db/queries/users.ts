import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { oauthAccounts, users, type OAuthProvider, type User } from "@/db/schema";

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);
  return user ?? null;
}

export async function listOAuthAccountsForUser(userId: string) {
  return db
    .select({ provider: oauthAccounts.provider, createdAt: oauthAccounts.createdAt })
    .from(oauthAccounts)
    .where(eq(oauthAccounts.userId, userId));
}

export async function getUserByOAuthAccount(
  provider: OAuthProvider,
  providerAccountId: string,
): Promise<User | null> {
  const [row] = await db
    .select({ user: users })
    .from(oauthAccounts)
    .innerJoin(users, eq(oauthAccounts.userId, users.id))
    .where(
      and(eq(oauthAccounts.provider, provider), eq(oauthAccounts.providerAccountId, providerAccountId)),
    )
    .limit(1);
  return row?.user ?? null;
}
