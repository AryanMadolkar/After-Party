import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessions, users, type User } from "@/db/schema";

export async function getUserBySessionTokenHash(tokenHash: string): Promise<User | null> {
  const [row] = await db
    .select({ user: users, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);

  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;

  return row.user;
}
