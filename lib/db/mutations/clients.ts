import "server-only";

import { and, count, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import {
  brandKits,
  clients,
  type BrandKit as BrandKitRow,
  type Client as ClientRow,
  type NewBrandKit,
  type NewClient,
} from "@/db/schema";

export async function insertClient(
  input: Pick<NewClient, "orgId" | "name" | "slug" | "externalRef" | "status">,
): Promise<ClientRow> {
  const [row] = await db
    .insert(clients)
    .values({
      orgId: input.orgId,
      name: input.name,
      slug: input.slug,
      externalRef: input.externalRef ?? null,
      status: input.status ?? "active",
    })
    .returning();
  return row;
}

export async function updateClientRow(
  orgId: string,
  clientId: string,
  patch: Partial<Pick<NewClient, "name" | "slug" | "externalRef" | "status">>,
): Promise<ClientRow | null> {
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  ) as Partial<Pick<NewClient, "name" | "slug" | "externalRef" | "status">>;
  const [row] = await db
    .update(clients)
    .set({ ...cleaned, updatedAt: new Date() })
    .where(and(eq(clients.id, clientId), eq(clients.orgId, orgId)))
    .returning();
  return row ?? null;
}

export async function insertBrandKit(
  input: Pick<NewBrandKit, "orgId" | "clientId" | "updatedBy">,
): Promise<BrandKitRow> {
  const [row] = await db
    .insert(brandKits)
    .values({
      orgId: input.orgId,
      clientId: input.clientId,
      updatedBy: input.updatedBy ?? null,
      captionLanguages: ["en"],
      secondaryColors: [],
      dos: [],
      donts: [],
      sampleCaptions: [],
      forbiddenTopics: [],
      mustIncludeHints: [],
    })
    .returning();
  return row;
}

export async function updateBrandKitRow(
  orgId: string,
  clientId: string,
  patch: Partial<
    Pick<
      NewBrandKit,
      | "primaryColor"
      | "secondaryColors"
      | "logoBlobKey"
      | "voiceNotes"
      | "dos"
      | "donts"
      | "sampleCaptions"
      | "captionLanguages"
      | "forbiddenTopics"
      | "mustIncludeHints"
      | "updatedBy"
    >
  >,
): Promise<BrandKitRow | null> {
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  );
  const [row] = await db
    .update(brandKits)
    .set({ ...cleaned, updatedAt: new Date() })
    .where(and(eq(brandKits.clientId, clientId), eq(brandKits.orgId, orgId)))
    .returning();
  return row ?? null;
}

export async function countActiveClients(orgId: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(clients)
    .where(and(eq(clients.orgId, orgId), eq(clients.status, "active")));
  return Number(row?.value ?? 0);
}

export async function getClientByOrgSlug(
  orgId: string,
  slug: string,
  excludeId?: string,
): Promise<ClientRow | null> {
  const clauses = [eq(clients.orgId, orgId), eq(clients.slug, slug)];
  if (excludeId) clauses.push(ne(clients.id, excludeId));
  const [row] = await db
    .select()
    .from(clients)
    .where(and(...clauses))
    .limit(1);
  return row ?? null;
}
