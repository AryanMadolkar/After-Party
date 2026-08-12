/**
 * Runs in the browser, before upload. Extracts just enough metadata to
 * populate `photos.exif_data`, `width`, and `height` without ever sending
 * the full original through a server for parsing.
 */

export type ExtractedPhotoMetadata = {
  width: number | null;
  height: number | null;
  exifData: Record<string, unknown> | null;
};

/** Keys worth keeping from the raw EXIF blob — small, JSON-safe, useful later for context understanding. */
const EXIF_KEYS_TO_KEEP = [
  "Make",
  "Model",
  "DateTimeOriginal",
  "LensModel",
  "FNumber",
  "ISO",
  "ExposureTime",
  "FocalLength",
  "GPSLatitude",
  "GPSLongitude",
  "Orientation",
] as const;

export async function extractPhotoMetadata(file: File): Promise<ExtractedPhotoMetadata> {
  const [dimensions, exifData] = await Promise.all([
    readImageDimensions(file),
    readExifSubset(file),
  ]);

  return {
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    exifData,
  };
}

async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number } | null> {
  if (typeof createImageBitmap !== "undefined") {
    try {
      const bitmap = await createImageBitmap(file);
      const dimensions = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return dimensions;
    } catch {
      // Falls through to the <img> based approach (e.g. HEIC in browsers
      // that can't decode it via createImageBitmap).
    }
  }

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

async function readExifSubset(file: File): Promise<Record<string, unknown> | null> {
  try {
    const exifr = await import("exifr");
    const raw = await exifr.parse(file, EXIF_KEYS_TO_KEEP as unknown as string[]);
    if (!raw) return null;

    const safe: Record<string, unknown> = {};
    for (const key of EXIF_KEYS_TO_KEEP) {
      const value = raw[key];
      if (value === undefined || value === null) continue;
      // Dates and typed arrays aren't JSON-serializable as-is.
      if (value instanceof Date) {
        safe[key] = value.toISOString();
      } else if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
        safe[key] = value;
      }
    }
    return Object.keys(safe).length > 0 ? safe : null;
  } catch {
    // Corrupt or stripped EXIF shouldn't block an upload.
    return null;
  }
}
