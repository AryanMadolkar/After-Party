import "server-only";

import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { photoAnalysis, photos, type Photo, type PhotoAnalysis } from "@/db/schema";

const PHOTOS_PAGE_SIZE = 60;

/**
 * Lists every photo in a project, scoped to the owning user. Callers must
 * already know `userId` owns `projectId` (or pass it straight through —
 * the WHERE clause makes cross-user access impossible either way, since a
 * photo only matches if both its projectId AND userId line up).
 */
export async function listPhotosForProject(
  projectId: string,
  userId: string,
): Promise<Photo[]> {
  return db
    .select()
    .from(photos)
    .where(and(eq(photos.projectId, projectId), eq(photos.userId, userId)))
    .orderBy(asc(photos.createdAt));
}

export { PHOTOS_PAGE_SIZE };

/**
 * Paginated photo listing for the grid — projects can hold up to 300
 * photos, and rendering all of them (with next/image srcsets) at once
 * would be wasteful, so the grid fetches a page at a time.
 */
export async function listPhotosPageForProject(
  projectId: string,
  userId: string,
  page: number,
): Promise<{ photos: Photo[]; total: number; pageSize: number }> {
  const safePage = Math.max(1, page);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(photos)
      .where(and(eq(photos.projectId, projectId), eq(photos.userId, userId)))
      .orderBy(asc(photos.createdAt))
      .limit(PHOTOS_PAGE_SIZE)
      .offset((safePage - 1) * PHOTOS_PAGE_SIZE),
    db
      .select({ total: count() })
      .from(photos)
      .where(and(eq(photos.projectId, projectId), eq(photos.userId, userId))),
  ]);

  return { photos: rows, total, pageSize: PHOTOS_PAGE_SIZE };
}

export async function getPhotoForUser(
  photoId: string,
  userId: string,
): Promise<Photo | null> {
  const [photo] = await db
    .select()
    .from(photos)
    .where(and(eq(photos.id, photoId), eq(photos.userId, userId)))
    .limit(1);

  return photo ?? null;
}

export async function listAnalysisForProject(
  projectId: string,
  userId: string,
): Promise<Record<string, PhotoAnalysis>> {
  const rows = await db
    .select({ analysis: photoAnalysis })
    .from(photoAnalysis)
    .innerJoin(photos, eq(photoAnalysis.photoId, photos.id))
    .where(and(eq(photos.projectId, projectId), eq(photos.userId, userId)));

  return Object.fromEntries(rows.map((row) => [row.analysis.photoId, row.analysis]));
}
