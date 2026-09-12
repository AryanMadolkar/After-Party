import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { memberships, type MembershipRow } from "@/db/schema";

export async function getMembershipForUser(
  orgId: string,
  userId: string,
): Promise<MembershipRow | null> {
  const [row] = await db
    .select()
    .from(memberships)
    .where(and(eq(memberships.orgId, orgId), eq(memberships.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function listMembershipsForUser(userId: string): Promise<MembershipRow[]> {
  return db.select().from(memberships).where(eq(memberships.userId, userId));
}
