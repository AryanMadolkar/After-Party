import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  selectionPhotos,
  selections,
  type NewSelectionPhoto,
  type Selection,
  type SelectionType,
} from "@/db/schema";

type CreateSelectionInput = {
  projectId: string;
  userId: string;
  type: SelectionType;
  photos: Array<{ photoId: string; position: number; aiSelected?: boolean }>;
};

/**
 * Creates a selection (e.g. "carousel", "best_photos") along with its
 * ordered photo membership, in a single transaction so the two never end
 * up out of sync.
 */
export async function createSelectionWithPhotos(
  input: CreateSelectionInput,
): Promise<Selection> {
  return db.transaction(async (tx) => {
    const [selection] = await tx
      .insert(selections)
      .values({ projectId: input.projectId, userId: input.userId, type: input.type })
      .returning();

    if (input.photos.length > 0) {
      const rows: NewSelectionPhoto[] = input.photos.map((photo) => ({
        selectionId: selection.id,
        photoId: photo.photoId,
        position: photo.position,
        aiSelected: photo.aiSelected ?? true,
        userApproved: false,
      }));
      await tx.insert(selectionPhotos).values(rows);
    }

    return selection;
  });
}

export async function reorderSelectionPhotos(
  selectionId: string,
  userId: string,
  orderedPhotoIds: string[],
): Promise<void> {
  const owned = await db
    .select({ id: selections.id })
    .from(selections)
    .where(and(eq(selections.id, selectionId), eq(selections.userId, userId)))
    .limit(1);

  if (owned.length === 0) throw new Error("Selection not found");

  await db.transaction(async (tx) => {
    await Promise.all(
      orderedPhotoIds.map((photoId, index) =>
        tx
          .update(selectionPhotos)
          .set({ position: index })
          .where(
            and(
              eq(selectionPhotos.selectionId, selectionId),
              eq(selectionPhotos.photoId, photoId),
            ),
          ),
      ),
    );
  });
}

export async function removePhotoFromSelection(
  selectionId: string,
  userId: string,
  photoId: string,
): Promise<void> {
  const owned = await db
    .select({ id: selections.id })
    .from(selections)
    .where(and(eq(selections.id, selectionId), eq(selections.userId, userId)))
    .limit(1);

  if (owned.length === 0) throw new Error("Selection not found");

  await db
    .delete(selectionPhotos)
    .where(
      and(
        eq(selectionPhotos.selectionId, selectionId),
        eq(selectionPhotos.photoId, photoId),
      ),
    );
}

export async function addPhotoToSelection(
  selectionId: string,
  userId: string,
  photoId: string,
  position: number,
): Promise<void> {
  const owned = await db
    .select({ id: selections.id })
    .from(selections)
    .where(and(eq(selections.id, selectionId), eq(selections.userId, userId)))
    .limit(1);

  if (owned.length === 0) throw new Error("Selection not found");

  await db
    .insert(selectionPhotos)
    .values({ selectionId, photoId, position, aiSelected: false, userApproved: true });
}
