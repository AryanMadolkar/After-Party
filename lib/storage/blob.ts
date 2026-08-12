// Intentionally NOT server-only: this module holds shared constants and a
// pure path-builder function that both the client (to construct the
// upload pathname) and the server (to independently verify it) need.
// It never touches secrets — the actual Blob token lives only in
// app/api/upload/route.ts via the BLOB_READ_WRITE_TOKEN env var.

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export const MAX_PHOTOS_PER_PROJECT = 300;
export const MAX_ORIGINAL_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_THUMBNAIL_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

export type BlobAssetKind = "originals" | "thumbnails";

/**
 * Storage layout: after-party/{userId}/{projectId}/{originals|thumbnails}/{filename}
 *
 * Scoping every path by userId and projectId means a leaked/guessed blob URL
 * for one user's photo never collides with another user's, and makes it
 * trivial to reason about (and eventually bulk-delete) a project's assets.
 */
export function buildBlobPath(input: {
  userId: string;
  projectId: string;
  kind: BlobAssetKind;
  filename: string;
}): string {
  const safeName = sanitizeFilename(input.filename);
  return `after-party/${input.userId}/${input.projectId}/${input.kind}/${safeName}`;
}

function sanitizeFilename(filename: string): string {
  const base = filename.split("/").pop() ?? filename;
  return base.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-180);
}

export function isAllowedImageMimeType(mimeType: string): mimeType is AllowedImageMimeType {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}
