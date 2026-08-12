import { upload } from "@vercel/blob/client";

import {
  MAX_ORIGINAL_FILE_SIZE_BYTES,
  buildBlobPath,
  isAllowedImageMimeType,
} from "@/lib/storage/blob";
import { computePerceptualHash } from "@/lib/photos/duplicates";
import { extractPhotoMetadata } from "@/lib/photos/metadata";
import { generateThumbnail } from "@/lib/photos/thumbnails";

// HEIC/HEIF files are frequently reported with an empty or generic MIME
// type by the OS file picker, so fall back to checking the extension.
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "heic", "heif", "webp"];

export type FileValidationError = {
  file: File;
  reason: "unsupported_type" | "too_large";
};

export function validateFiles(files: File[]): {
  valid: File[];
  errors: FileValidationError[];
} {
  const valid: File[] = [];
  const errors: FileValidationError[] = [];

  for (const file of files) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const looksLikeImage =
      isAllowedImageMimeType(file.type) || ALLOWED_EXTENSIONS.includes(extension);

    if (!looksLikeImage) {
      errors.push({ file, reason: "unsupported_type" });
      continue;
    }
    if (file.size > MAX_ORIGINAL_FILE_SIZE_BYTES) {
      errors.push({ file, reason: "too_large" });
      continue;
    }
    valid.push(file);
  }

  return { valid, errors };
}

export type UploadedPhotoResult = {
  fileId: string;
  blobUrl: string;
  thumbnailUrl: string;
  originalFilename: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  fileSize: number;
  exifData: Record<string, unknown> | null;
  perceptualHash: string | null;
};

export type UploadStatusEvent =
  | { type: "started"; fileId: string }
  | { type: "progress"; fileId: string; percentage: number }
  | { type: "processed"; fileId: string; result: UploadedPhotoResult }
  | { type: "failed"; fileId: string; error: string };

type UploadOneOptions = {
  file: File;
  fileId: string;
  projectId: string;
  userId: string;
  onEvent: (event: UploadStatusEvent) => void;
};

async function uploadOnePhoto({ file, fileId, projectId, userId, onEvent }: UploadOneOptions) {
  onEvent({ type: "started", fileId });

  try {
    const uniqueName = `${crypto.randomUUID()}-${file.name}`;

    const [metadata, thumbnailFile, perceptualHash] = await Promise.all([
      extractPhotoMetadata(file),
      generateThumbnail(file),
      computePerceptualHash(file),
    ]);

    // This path is advisory only — the route handler independently
    // recomputes it from the *authenticated* user's id and rejects the
    // upload if a tampered client sends a different one. See
    // app/api/upload/route.ts.
    const originalPath = buildBlobPath({
      userId,
      projectId,
      kind: "originals",
      filename: uniqueName,
    });

    const originalBlob = await upload(originalPath, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      clientPayload: JSON.stringify({ projectId, kind: "originals", filename: uniqueName }),
      contentType: file.type || undefined,
      onUploadProgress: ({ percentage }) => {
        onEvent({ type: "progress", fileId, percentage: percentage * 0.7 });
      },
    });

    let thumbnailUrl = originalBlob.url;
    if (thumbnailFile) {
      const thumbnailPath = buildBlobPath({
        userId,
        projectId,
        kind: "thumbnails",
        filename: uniqueName.replace(/\.[^.]+$/, ".jpg"),
      });
      const thumbnailBlob = await upload(thumbnailPath, thumbnailFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        clientPayload: JSON.stringify({
          projectId,
          kind: "thumbnails",
          filename: uniqueName.replace(/\.[^.]+$/, ".jpg"),
        }),
        contentType: "image/jpeg",
        onUploadProgress: ({ percentage }) => {
          onEvent({ type: "progress", fileId, percentage: 70 + percentage * 0.3 });
        },
      });
      thumbnailUrl = thumbnailBlob.url;
    } else {
      onEvent({ type: "progress", fileId, percentage: 100 });
    }

    onEvent({
      type: "processed",
      fileId,
      result: {
        fileId,
        blobUrl: originalBlob.url,
        thumbnailUrl,
        originalFilename: file.name,
        mimeType: file.type || "application/octet-stream",
        width: metadata.width,
        height: metadata.height,
        fileSize: file.size,
        exifData: metadata.exifData,
        perceptualHash,
      },
    });
  } catch (error) {
    onEvent({
      type: "failed",
      fileId,
      error: error instanceof Error ? error.message : "Upload failed.",
    });
  }
}

/**
 * Uploads a batch of files with bounded concurrency so hundreds of photos
 * never turn into hundreds of simultaneous in-flight requests (which would
 * saturate the browser's connection pool and make progress reporting
 * meaningless). Each file streams directly to Vercel Blob — nothing routes
 * through this app's server, so server memory stays flat regardless of
 * batch size.
 */
export async function uploadPhotoBatch(options: {
  files: Array<{ file: File; fileId: string }>;
  projectId: string;
  userId: string;
  concurrency?: number;
  onEvent: (event: UploadStatusEvent) => void;
}): Promise<void> {
  const { files, projectId, userId, onEvent, concurrency = 4 } = options;
  let cursor = 0;

  async function worker() {
    while (cursor < files.length) {
      const index = cursor;
      cursor += 1;
      const { file, fileId } = files[index];
      await uploadOnePhoto({ file, fileId, projectId, userId, onEvent });
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, files.length) }, () => worker());
  await Promise.all(workers);
}
