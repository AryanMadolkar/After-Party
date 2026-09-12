import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { organizations, type NewOrganization, type Organization } from "@/db/schema";

export async function createOrganizationRow(
  input: Pick<NewOrganization, "name" | "slug" | "planId">,
): Promise<Organization> {
  const [org] = await db
    .insert(organizations)
    .values({
      name: input.name,
      slug: input.slug,
      planId: input.planId ?? "studio",
    })
    .returning();
  return org;
}
