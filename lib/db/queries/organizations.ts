import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { organizations, type Organization } from "@/db/schema";

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .limit(1);
  return org ?? null;
}

export async function getOrganizationById(orgId: string): Promise<Organization | null> {
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  return org ?? null;
}
