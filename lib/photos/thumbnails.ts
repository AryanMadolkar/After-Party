/**
 * Client-side thumbnail generation. Downscaling in the browser before
 * upload means the grid never has to fetch multi-megabyte originals, and
 * the server never has to hold hundreds of full-resolution images in
 * memory to resize them.
 *
 * TODO(real pipeline): move this server-side (e.g. a Blob-triggered
 * function using sharp) once formats the canvas can't decode (some HEIC
 * variants) need to be handled uniformly, and to generate multiple sizes.
 */

const THUMBNAIL_MAX_DIMENSION = 960;
const THUMBNAIL_QUALITY = 0.82;

export async function generateThumbnail(file: File): Promise<File | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, THUMBNAIL_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return null;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", THUMBNAIL_QUALITY),
    );
    if (!blob) return null;

    const thumbnailName = withThumbnailSuffix(file.name);
    return new File([blob], thumbnailName, { type: "image/jpeg" });
  } catch {
    // Formats the browser can't decode (some HEIC sources, corrupt files)
    // fall back to using the original as its own "thumbnail" upstream.
    return null;
  }
}

function withThumbnailSuffix(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const base = dot === -1 ? filename : filename.slice(0, dot);
  return `${base}.jpg`;
}
