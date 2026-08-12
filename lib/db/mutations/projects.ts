import "server-only";

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { projects, type Project, type NewProject } from "@/db/schema";

export async function createProject(input: {
  userId: string;
  name: string;
}): Promise<Project> {
  const [project] = await db
    .insert(projects)
    .values({ userId: input.userId, name: input.name, status: "draft" })
    .returning();

  return project;
}

/**
 * Updates a project, scoped to its owner via the WHERE clause. If the
 * project doesn't belong to `userId`, zero rows are affected and null is
 * returned — this is what makes it safe to call with a client-supplied
 * projectId.
 */
export async function updateProjectForUser(
  projectId: string,
  userId: string,
  patch: Partial<Pick<NewProject, "name" | "status" | "photoCount" | "coverPhotoId">>,
): Promise<Project | null> {
  const [project] = await db
    .update(projects)
    .set({ ...patch, updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning();

  return project ?? null;
}

/**
 * Atomically increments (or decrements, with a negative `by`) a project's
 * denormalized photo count. Using a SQL expression rather than
 * read-then-write avoids lost updates when many photo uploads land
 * concurrently.
 */
export async function incrementProjectPhotoCount(
  projectId: string,
  userId: string,
  by: number,
): Promise<void> {
  await db
    .update(projects)
    .set({
      photoCount: sql`${projects.photoCount} + ${by}`,
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

export async function deleteProjectForUser(
  projectId: string,
  userId: string,
): Promise<boolean> {
  const [deleted] = await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning({ id: projects.id });

  return Boolean(deleted);
}
