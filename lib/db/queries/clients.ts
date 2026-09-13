import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  brandKits,
  clients,
  type BrandKit as BrandKitRow,
  type Client as ClientRow,
  type ClientStatusColumn,
} from "@/db/schema";

export async function listClientsForOrg(
  orgId: string,
  opts: { includeArchived?: boolean } = {},
): Promise<ClientRow[]> {
  if (opts.includeArchived) {
    return db
      .select()
      .from(clients)
      .where(eq(clients.orgId, orgId))
      .orderBy(desc(clients.createdAt));
  }
  return db
    .select()
    .from(clients)
    .where(and(eq(clients.orgId, orgId), eq(clients.status, "active")))
    .orderBy(desc(clients.createdAt));
}

export async function getClientForOrg(
  orgId: string,
  clientId: string,
): Promise<ClientRow | null> {
  const [row] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.orgId, orgId)))
    .limit(1);
  return row ?? null;
}

export async function getBrandKitForClient(
  orgId: string,
  clientId: string,
): Promise<BrandKitRow | null> {
  const [row] = await db
    .select()
    .from(brandKits)
    .where(and(eq(brandKits.clientId, clientId), eq(brandKits.orgId, orgId)))
    .limit(1);
  return row ?? null;
}

export async function listClientsByStatus(
  orgId: string,
  status: ClientStatusColumn,
): Promise<ClientRow[]> {
  return db
    .select()
    .from(clients)
    .where(and(eq(clients.orgId, orgId), eq(clients.status, status)))
    .orderBy(desc(clients.createdAt));
}
