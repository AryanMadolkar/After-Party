import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { posts, projects, type Post } from "@/db/schema";

export async function listPostsForProject(
  projectId: string,
  userId: string,
): Promise<Post[]> {
  const rows = await db
    .select({ post: posts })
    .from(posts)
    .innerJoin(projects, eq(posts.projectId, projects.id))
    .where(and(eq(posts.projectId, projectId), eq(projects.userId, userId)))
    .orderBy(desc(posts.createdAt));

  return rows.map((row) => row.post);
}

export async function countPostsForProject(
  projectId: string,
  userId: string,
): Promise<number> {
  const rows = await listPostsForProject(projectId, userId);
  return rows.length;
}
