import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { auditLogs, type AuditLog } from "@/db/schema";

export async function listAuditLogsForOrg(
  orgId: string,
  action?: string,
): Promise<AuditLog[]> {
  if (action) {
    return db
      .select()
      .from(auditLogs)
      .where(and(eq(auditLogs.orgId, orgId), eq(auditLogs.action, action)));
  }
  return db.select().from(auditLogs).where(eq(auditLogs.orgId, orgId));
}
