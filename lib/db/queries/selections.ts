import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  selectionPhotos,
  selections,
  type Selection,
  type SelectionPhoto,
} from "@/db/schema";

export async function listSelectionsForProject(
  projectId: string,
  userId: string,
): Promise<Selection[]> {
  return db
    .select()
    .from(selections)
    .where(and(eq(selections.projectId, projectId), eq(selections.userId, userId)))
    .orderBy(desc(selections.createdAt));
}

export async function getSelectionForUser(
  selectionId: string,
  userId: string,
): Promise<Selection | null> {
  const [selection] = await db
    .select()
    .from(selections)
    .where(and(eq(selections.id, selectionId), eq(selections.userId, userId)))
    .limit(1);

  return selection ?? null;
}

export async function listSelectionPhotos(
  selectionId: string,
): Promise<SelectionPhoto[]> {
  return db
    .select()
    .from(selectionPhotos)
    .where(eq(selectionPhotos.selectionId, selectionId))
    .orderBy(asc(selectionPhotos.position));
}
