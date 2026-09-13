import "server-only";

import { randomBytes } from "node:crypto";

import {
  AuthError,
  BrandKitSchema,
  ClientSchema,
  CreateClientInput,
  UpdateBrandKitInput,
  UpdateClientInput,
  computeBrandKitCompleteness,
  getPlanLimits,
  PlanLimitError,
  type BrandKit,
  type BrandKitCompleteness,
  type Client,
  type Membership,
  type Role,
  type SessionUser,
} from "@/lib/contracts";
import { assertOrgMember, getSession, listCurrentMemberships } from "@/lib/auth/tenancy";
import { insertAuditLog } from "@/lib/db/mutations/audit-logs";
import {
  countActiveClients,
  getClientByOrgSlug,
  insertBrandKit,
  insertClient,
  updateBrandKitRow,
  updateClientRow,
} from "@/lib/db/mutations/clients";
import {
  getBrandKitForClient,
  getClientForOrg,
  listClientsForOrg,
} from "@/lib/db/queries/clients";
import { getOrganizationById } from "@/lib/db/queries/organizations";

const WRITE_ROLES: Role[] = ["owner", "producer"];

export type OrgContext = {
  user: SessionUser;
  orgId: string;
  membership: Membership;
  planId: "studio" | "agency" | "agency_plus";
};

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base.length > 0 ? base : "client";
}

async function allocateClientSlug(orgId: string, preferred: string): Promise<string> {
  let candidate = preferred.slice(0, 80);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const existing = await getClientByOrgSlug(orgId, candidate);
    if (!existing) return candidate;
    candidate = `${preferred.slice(0, 70)}-${randomBytes(2).toString("hex")}`;
  }
  throw new Error("Could not allocate a unique client slug.");
}

function toClient(row: unknown): Client {
  return ClientSchema.parse(row);
}

function toBrandKit(row: {
  id: string;
  orgId: string;
  clientId: string;
  primaryColor: string | null;
  secondaryColors: string[] | null;
  logoBlobKey: string | null;
  voiceNotes: string | null;
  dos: string[] | null;
  donts: string[] | null;
  sampleCaptions: string[] | null;
  captionLanguages: Array<"en" | "hi"> | null;
  forbiddenTopics: string[] | null;
  mustIncludeHints: string[] | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}): BrandKit {
  return BrandKitSchema.parse({
    ...row,
    secondaryColors: row.secondaryColors ?? [],
    dos: row.dos ?? [],
    donts: row.donts ?? [],
    sampleCaptions: row.sampleCaptions ?? [],
    captionLanguages: row.captionLanguages?.length ? row.captionLanguages : ["en"],
    forbiddenTopics: row.forbiddenTopics ?? [],
    mustIncludeHints: row.mustIncludeHints ?? [],
  });
}

/** Resolve session + primary org membership (CutRoom single-workspace for now). */
export async function requireOrgContext(roles?: readonly Role[]): Promise<OrgContext> {
  const user = await getSession();
  if (!user) throw new AuthError("UNAUTHORIZED", "Sign in required.");

  const memberships = await listCurrentMemberships();
  if (memberships.length === 0) {
    throw new AuthError("FORBIDDEN", "No organization membership.");
  }
  const membership = memberships[0];
  await assertOrgMember(membership.orgId, roles);

  const org = await getOrganizationById(membership.orgId);
  if (!org) throw new AuthError("FORBIDDEN", "Organization not found.");

  return {
    user,
    orgId: membership.orgId,
    membership,
    planId: org.planId,
  };
}

export async function listClients(opts: { includeArchived?: boolean } = {}): Promise<{
  clients: Client[];
  activeCount: number;
  limit: number;
  planId: OrgContext["planId"];
}> {
  const ctx = await requireOrgContext();
  const rows = await listClientsForOrg(ctx.orgId, opts);
  const activeCount = await countActiveClients(ctx.orgId);
  const limits = getPlanLimits(ctx.planId);
  return {
    clients: rows.map(toClient),
    activeCount,
    limit: limits.clients,
    planId: ctx.planId,
  };
}

export async function createClient(input: CreateClientInput): Promise<{
  client: Client;
  brandKit: BrandKit;
  completeness: BrandKitCompleteness;
}> {
  const ctx = await requireOrgContext(WRITE_ROLES);
  const data = CreateClientInput.parse(input);

  const activeCount = await countActiveClients(ctx.orgId);
  const limits = getPlanLimits(ctx.planId);
  if (activeCount >= limits.clients) {
    throw new PlanLimitError(
      "PLAN_LIMIT_CLIENTS",
      `Plan ${ctx.planId} allows ${limits.clients} active clients.`,
    );
  }

  const slug = await allocateClientSlug(ctx.orgId, data.slug ?? slugify(data.name));
  const client = toClient(
    await insertClient({
      orgId: ctx.orgId,
      name: data.name,
      slug,
      externalRef: data.externalRef ?? null,
      status: "active",
    }),
  );

  const kit = toBrandKit(
    await insertBrandKit({
      orgId: ctx.orgId,
      clientId: client.id,
      updatedBy: ctx.user.id,
    }),
  );

  await insertAuditLog({
    orgId: ctx.orgId,
    actorUserId: ctx.user.id,
    action: "client.created",
    targetType: "client",
    targetId: client.id,
    metadata: { name: client.name, slug: client.slug },
  });

  return {
    client,
    brandKit: kit,
    completeness: computeBrandKitCompleteness(kit),
  };
}

export async function updateClient(
  clientId: string,
  input: UpdateClientInput,
): Promise<Client> {
  const ctx = await requireOrgContext(WRITE_ROLES);
  const data = UpdateClientInput.parse(input);

  const existing = await getClientForOrg(ctx.orgId, clientId);
  if (!existing) throw new AuthError("FORBIDDEN", "Client not found in this organization.");

  if (data.slug && data.slug !== existing.slug) {
    const clash = await getClientByOrgSlug(ctx.orgId, data.slug, clientId);
    if (clash) throw new Error("A client with this slug already exists.");
  }

  // Reactivating archived client still counts toward plan limit.
  if (data.status === "active" && existing.status === "archived") {
    const activeCount = await countActiveClients(ctx.orgId);
    const limits = getPlanLimits(ctx.planId);
    if (activeCount >= limits.clients) {
      throw new PlanLimitError(
        "PLAN_LIMIT_CLIENTS",
        `Plan ${ctx.planId} allows ${limits.clients} active clients.`,
      );
    }
  }

  const updated = await updateClientRow(ctx.orgId, clientId, {
    name: data.name,
    slug: data.slug,
    externalRef: data.externalRef,
    status: data.status,
  });
  if (!updated) throw new AuthError("FORBIDDEN", "Client not found in this organization.");
  return toClient(updated);
}

export async function archiveClient(clientId: string): Promise<Client> {
  return updateClient(clientId, { status: "archived" });
}

export async function getClient(clientId: string): Promise<Client> {
  const ctx = await requireOrgContext();
  const row = await getClientForOrg(ctx.orgId, clientId);
  if (!row) throw new AuthError("FORBIDDEN", "Client not found in this organization.");
  return toClient(row);
}

export async function getBrandKit(clientId: string): Promise<{
  brandKit: BrandKit;
  completeness: BrandKitCompleteness;
  canEdit: boolean;
}> {
  const ctx = await requireOrgContext();
  const client = await getClientForOrg(ctx.orgId, clientId);
  if (!client) throw new AuthError("FORBIDDEN", "Client not found in this organization.");

  let kitRow = await getBrandKitForClient(ctx.orgId, clientId);
  if (!kitRow) {
    kitRow = await insertBrandKit({
      orgId: ctx.orgId,
      clientId,
      updatedBy: ctx.user.id,
    });
  }

  const brandKit = toBrandKit(kitRow);
  return {
    brandKit,
    completeness: computeBrandKitCompleteness(brandKit),
    canEdit: WRITE_ROLES.includes(ctx.membership.role),
  };
}

export async function updateBrandKit(
  clientId: string,
  input: UpdateBrandKitInput,
): Promise<{
  brandKit: BrandKit;
  completeness: BrandKitCompleteness;
}> {
  const ctx = await requireOrgContext(WRITE_ROLES);
  const data = UpdateBrandKitInput.parse(input);

  const client = await getClientForOrg(ctx.orgId, clientId);
  if (!client) throw new AuthError("FORBIDDEN", "Client not found in this organization.");

  let existing = await getBrandKitForClient(ctx.orgId, clientId);
  if (!existing) {
    existing = await insertBrandKit({
      orgId: ctx.orgId,
      clientId,
      updatedBy: ctx.user.id,
    });
  }

  const updated = await updateBrandKitRow(ctx.orgId, clientId, {
    ...data,
    updatedBy: ctx.user.id,
  });
  if (!updated) throw new AuthError("FORBIDDEN", "Brand kit not found in this organization.");

  const brandKit = toBrandKit(updated);
  const completeness = computeBrandKitCompleteness(brandKit);

  await insertAuditLog({
    orgId: ctx.orgId,
    actorUserId: ctx.user.id,
    action: "brand_kit.updated",
    targetType: "brand_kit",
    targetId: brandKit.id,
    metadata: {
      clientId,
      score: completeness.score,
      softWarnings: completeness.softWarnings,
    },
  });

  return { brandKit, completeness };
}

/** Stub for later Blob signed upload — returns a placeholder key path. */
export async function signBrandLogoUpload(clientId: string): Promise<{
  uploadUrl: string | null;
  logoBlobKey: string;
  stub: true;
}> {
  const ctx = await requireOrgContext(WRITE_ROLES);
  const client = await getClientForOrg(ctx.orgId, clientId);
  if (!client) throw new AuthError("FORBIDDEN", "Client not found in this organization.");
  const logoBlobKey = `orgs/${ctx.orgId}/clients/${clientId}/logo/${randomBytes(8).toString("hex")}`;
  return { uploadUrl: null, logoBlobKey, stub: true };
}
