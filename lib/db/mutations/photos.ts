import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { photoAnalysis, photos, type NewPhoto, type NewPhotoAnalysis, type Photo } from "@/db/schema";

export async function createPhoto(input: NewPhoto): Promise<Photo> {
  const [photo] = await db.insert(photos).values(input).returning();
  return photo;
}

export async function deletePhotoForUser(
  photoId: string,
  userId: string,
): Promise<boolean> {
  const [deleted] = await db
    .delete(photos)
    .where(and(eq(photos.id, photoId), eq(photos.userId, userId)))
    .returning({ id: photos.id });

  return Boolean(deleted);
}

/**
 * Bulk-deletes photos by id, scoped to the owning user. Used when a whole
 * project or a batch selection is discarded. Returns the ids that were
 * actually deleted, since ids the caller doesn't own are silently skipped.
 */
export async function deletePhotosForUser(
  photoIds: string[],
  userId: string,
): Promise<string[]> {
  if (photoIds.length === 0) return [];

  const deleted = await db
    .delete(photos)
    .where(and(inArray(photos.id, photoIds), eq(photos.userId, userId)))
    .returning({ id: photos.id });

  return deleted.map((row) => row.id);
}

export async function upsertPhotoAnalysis(
  input: NewPhotoAnalysis,
): Promise<void> {
  await db
    .insert(photoAnalysis)
    .values(input)
    .onConflictDoUpdate({
      target: photoAnalysis.photoId,
      set: { ...input, updatedAt: new Date() },
    });
}
