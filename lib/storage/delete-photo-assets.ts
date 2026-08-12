import "server-only";

import { del } from "@vercel/blob";

/**
 * Removes a photo's blob objects (original + thumbnail) from storage.
 * Best-effort: a failure here shouldn't block the corresponding database
 * row from being deleted, so callers should not let this throw abort the
 * user-facing delete action — log and move on.
 */
export async function deletePhotoBlobs(urls: Array<string | null | undefined>): Promise<void> {
  const targets = urls.filter((url): url is string => Boolean(url));
  if (targets.length === 0) return;

  try {
    await del(targets);
  } catch (error) {
    console.error("Failed to delete blob objects", error);
  }
}
