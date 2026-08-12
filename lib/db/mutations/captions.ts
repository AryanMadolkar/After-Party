import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { captions, projects, type Caption, type CaptionStyle } from "@/db/schema";

export async function createCaptionForProject(input: {
  projectId: string;
  userId: string;
  text: string;
  style: CaptionStyle;
}): Promise<Caption> {
  const [owned] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, input.projectId), eq(projects.userId, input.userId)))
    .limit(1);

  if (!owned) throw new Error("Project not found");

  const [caption] = await db
    .insert(captions)
    .values({ projectId: input.projectId, text: input.text, style: input.style })
    .returning();

  return caption;
}
