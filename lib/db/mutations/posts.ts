import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { posts, projects, type NewPost, type Post } from "@/db/schema";

export async function createPostForProject(
  input: Omit<NewPost, "id" | "createdAt"> & { userId: string },
): Promise<Post> {
  const [owned] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId)))
    .limit(1);

  if (!owned) throw new Error("Project not found");

  const { userId: _userId, ...values } = input;
  void _userId;

  const [post] = await db.insert(posts).values(values).returning();
  return post;
}
