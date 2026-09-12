import "server-only";

import { db } from "@/db";
import { auditLogs, type AuditLog, type NewAuditLog } from "@/db/schema";

export async function insertAuditLog(
  input: Pick<
    NewAuditLog,
    "orgId" | "actorUserId" | "action" | "targetType" | "targetId" | "metadata"
  >,
): Promise<AuditLog> {
  const [row] = await db.insert(auditLogs).values(input).returning();
  return row;
}
