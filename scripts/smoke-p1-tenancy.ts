/**
 * One-shot Neon smoke: user → createOrg → owner membership + audit + cross-tenant.
 * Run: npx tsx --env-file=.env.local scripts/smoke-p1-tenancy.ts
 */
import { eq, or } from "drizzle-orm";

import { db } from "../db";
import { auditLogs, organizations, users } from "../db/schema";
import { hashPassword } from "../lib/auth/password";
import { createOrgForUser } from "../lib/auth/tenancy";
import { createUserWithPassword } from "../lib/db/mutations/users";
import { getMembershipForUser } from "../lib/db/queries/memberships";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const stamp = Date.now();
  const passwordHash = await hashPassword("smoke-test-password-9");

  const user = await createUserWithPassword({
    email: `p1-smoke-${stamp}@example.com`,
    passwordHash,
    name: "P1 Smoke",
  });

  const org = await createOrgForUser(user.id, {
    name: `Smoke Org ${stamp}`,
    slug: `smoke-org-${stamp}`,
  });

  const membership = await getMembershipForUser(org.id, user.id);
  if (!membership || membership.role !== "owner") {
    throw new Error("Expected owner membership after createOrg");
  }

  const [audit] = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.orgId, org.id))
    .limit(5);

  if (!audit || audit.action !== "org.created") {
    throw new Error("Expected audit_logs.org.created");
  }

  const other = await createUserWithPassword({
    email: `p1-smoke-other-${stamp}@example.com`,
    passwordHash,
    name: "Other",
  });
  const otherOrg = await createOrgForUser(other.id, {
    name: `Other Org ${stamp}`,
    slug: `other-org-${stamp}`,
  });

  const cross = await getMembershipForUser(org.id, other.id);
  if (cross) {
    throw new Error("Cross-tenant leak: other user is member of org A");
  }

  await db.delete(auditLogs).where(
    or(eq(auditLogs.actorUserId, user.id), eq(auditLogs.actorUserId, other.id)),
  );
  await db.delete(organizations).where(eq(organizations.id, org.id));
  await db.delete(organizations).where(eq(organizations.id, otherOrg.id));
  await db.delete(users).where(eq(users.id, user.id));
  await db.delete(users).where(eq(users.id, other.id));

  console.log("P1 smoke OK:", {
    orgId: org.id,
    planId: org.planId,
    membershipRole: membership.role,
    auditAction: audit.action,
    crossTenantBlocked: true,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
