import "server-only";

import { db } from "@/db";
import { memberships, type MembershipRow, type NewMembership } from "@/db/schema";

export async function createMembershipRow(
  input: Pick<NewMembership, "orgId" | "userId" | "role">,
): Promise<MembershipRow> {
  const [row] = await db.insert(memberships).values(input).returning();
  return row;
}
