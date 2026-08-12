import "server-only";

import { cache } from "react";
import { and, asc, count, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { photos, posts, projects, type Project } from "@/db/schema";

/**
 * Lists projects belonging to a specific user. `userId` must come from
 * `getCurrentUser()` / `requireCurrentUser()` — never from client input.
 */
export async function listProjectsForUser(userId: string): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));
}

/**
 * Fetches a single project, scoped to its owner. Returns null if the
 * project doesn't exist OR belongs to someone else — callers should treat
 * both cases identically (404, not 403) to avoid leaking existence.
 */
export const getProjectForUser = cache(
  async (projectId: string, userId: string): Promise<Project | null> => {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);

    return project ?? null;
  },
);

export type ProjectWithStats = Project & {
  postCount: number;
  coverThumbnailUrl: string | null;
};

/**
 * Dashboard view: each project plus its post count and a cover thumbnail
 * (its earliest uploaded photo, until AI-selected covers exist). Uses only
 * typed query-builder calls — no raw SQL — reducing "first photo per
 * project" client-side to keep this safe to run without a DISTINCT ON.
 */
export async function listProjectsWithStatsForUser(userId: string): Promise<ProjectWithStats[]> {
  const userProjects = await listProjectsForUser(userId);
  if (userProjects.length === 0) return [];

  const projectIds = userProjects.map((project) => project.id);

  const [postCounts, coverPhotos] = await Promise.all([
    db
      .select({ projectId: posts.projectId, total: count() })
      .from(posts)
      .where(inArray(posts.projectId, projectIds))
      .groupBy(posts.projectId),
    db
      .select({ projectId: photos.projectId, thumbnailUrl: photos.thumbnailUrl })
      .from(photos)
      .where(inArray(photos.projectId, projectIds))
      .orderBy(asc(photos.createdAt)),
  ]);

  const postCountByProject = new Map(postCounts.map((row) => [row.projectId, row.total]));
  const coverByProject = new Map<string, string | null>();
  for (const photo of coverPhotos) {
    if (!coverByProject.has(photo.projectId)) {
      coverByProject.set(photo.projectId, photo.thumbnailUrl);
    }
  }

  return userProjects.map((project) => ({
    ...project,
    postCount: postCountByProject.get(project.id) ?? 0,
    coverThumbnailUrl: coverByProject.get(project.id) ?? null,
  }));
}
