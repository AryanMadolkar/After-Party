import "server-only";

import { randomBytes } from "node:crypto";

import { getCurrentUser, requireCurrentUser } from "@/lib/auth/current-user";
import {
  AuthError,
  CreateOrgInput,
  MembershipSchema,
  OrgPublic,
  SessionUserSchema,
  type Membership,
  type Role,
  type SessionUser,
} from "@/lib/contracts";
import { insertAuditLog } from "@/lib/db/mutations/audit-logs";
import { createMembershipRow } from "@/lib/db/mutations/memberships";
import { createOrganizationRow } from "@/lib/db/mutations/organizations";
import {
  getMembershipForUser,
  listMembershipsForUser,
} from "@/lib/db/queries/memberships";
import { getOrganizationBySlug } from "@/lib/db/queries/organizations";

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base.length > 0 ? base : "org";
}

async function allocateUniqueSlug(preferred: string): Promise<string> {
  let candidate = preferred.slice(0, 80);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const existing = await getOrganizationBySlug(candidate);
    if (!existing) return candidate;
    const suffix = randomBytes(2).toString("hex");
    candidate = `${preferred.slice(0, 70)}-${suffix}`;
  }
  throw new Error("Could not allocate a unique organization slug.");
}

function toMembership(row: {
  id: string;
  orgId: string;
  userId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}): Membership {
  return MembershipSchema.parse(row);
}

/**
 * Creates an organization + owner membership for `userId`.
 * Default plan is `studio`. Writes `org.created` to audit_logs.
 */
export async function createOrgForUser(
  userId: string,
  input: CreateOrgInput,
): Promise<OrgPublic> {
  const data = CreateOrgInput.parse(input);

  const preferredSlug = data.slug ?? slugify(data.name);
  const slug = await allocateUniqueSlug(preferredSlug);

  const org = await createOrganizationRow({
    name: data.name,
    slug,
    planId: data.planId ?? "studio",
  });

  await createMembershipRow({
    orgId: org.id,
    userId,
    role: "owner",
  });

  await insertAuditLog({
    orgId: org.id,
    actorUserId: userId,
    action: "org.created",
    targetType: "organization",
    targetId: org.id,
    metadata: { name: org.name, slug: org.slug, planId: org.planId },
  });

  return OrgPublic.parse({
    id: org.id,
    name: org.name,
    slug: org.slug,
    planId: org.planId,
  });
}

/**
 * Creates an organization + owner membership for the signed-in user.
 * Default plan is `studio`. Writes `org.created` to audit_logs.
 */
export async function createOrg(input: CreateOrgInput): Promise<OrgPublic> {
  const user = await requireCurrentUser();
  return createOrgForUser(user.id, input);
}

/** Session user for the current httpOnly cookie, or null. */
export async function getSession(): Promise<SessionUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return SessionUserSchema.parse({
    id: user.id,
    email: user.email,
    name: user.name ?? null,
  });
}

/** Membership for the current session user in `orgId`, or null if none. */
export async function getCurrentMembership(orgId: string): Promise<Membership | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const row = await getMembershipForUser(orgId, user.id);
  return row ? toMembership(row) : null;
}

export async function listCurrentMemberships(): Promise<Membership[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const rows = await listMembershipsForUser(user.id);
  return rows.map(toMembership);
}

/**
 * Ensures the session user is a member of `orgId`, optionally restricted to
 * `roles`. Throws AuthError 401 if unsigned-in, 403 if missing/wrong role.
 */
export async function assertOrgMember(
  orgId: string,
  roles?: readonly Role[],
): Promise<Membership> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("UNAUTHORIZED", "Sign in required.");
  }

  const row = await getMembershipForUser(orgId, user.id);
  if (!row) {
    throw new AuthError("FORBIDDEN", "Not a member of this organization.");
  }

  if (roles && roles.length > 0 && !roles.includes(row.role)) {
    throw new AuthError("FORBIDDEN", "Insufficient role for this organization.");
  }

  return toMembership(row);
}
