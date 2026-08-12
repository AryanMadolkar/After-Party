import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { captions, projects, type Caption } from "@/db/schema";

/**
 * Captions don't carry a userId column of their own, so ownership is
 * verified by joining through the parent project.
 */
export async function listCaptionsForProject(
  projectId: string,
  userId: string,
): Promise<Caption[]> {
  const rows = await db
    .select({ caption: captions })
    .from(captions)
    .innerJoin(projects, eq(captions.projectId, projects.id))
    .where(and(eq(captions.projectId, projectId), eq(projects.userId, userId)))
    .orderBy(desc(captions.createdAt));

  return rows.map((row) => row.caption);
}
