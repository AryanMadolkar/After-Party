import { z } from "zod";

/** §19.6 upload / vision / export constants (CutRoom product limits). */
export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export type AllowedMime = (typeof ALLOWED_MIME)[number];

export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB
export const MAX_FILES_PER_SHOOT = 500;
export const VISION_MAX_EDGE_PX = 1280;
export const EXPORT_JPEG_QUALITY = 85;

export const DEFAULT_SELECT_TARGETS = {
  feed: 9,
  stories: 5,
  linkedin: 3,
} as const;

export type SelectTargetChannel = keyof typeof DEFAULT_SELECT_TARGETS;

export const REVIEW_LINK_DEFAULT_DAYS = 7;

/**
 * Placeholder perceptual/embedding dedup threshold (0–1 similarity).
 * Real HEIC/dedup lands in Solo-P5/P6 — tune against embedding distance then.
 * Documented default: 0.92 (near-duplicates collapse above this cosine similarity).
 */
export const DEDUP_THRESHOLD = 0.92;

export const UploadLimitsSchema = z.object({
  maxFileBytes: z.literal(MAX_FILE_BYTES),
  maxFilesPerShoot: z.literal(MAX_FILES_PER_SHOOT),
  visionMaxEdgePx: z.literal(VISION_MAX_EDGE_PX),
  exportJpegQuality: z.literal(EXPORT_JPEG_QUALITY),
  reviewLinkDefaultDays: z.literal(REVIEW_LINK_DEFAULT_DAYS),
  dedupThreshold: z.literal(DEDUP_THRESHOLD),
  allowedMime: z.array(z.enum(ALLOWED_MIME)),
  defaultSelectTargets: z.object({
    feed: z.literal(DEFAULT_SELECT_TARGETS.feed),
    stories: z.literal(DEFAULT_SELECT_TARGETS.stories),
    linkedin: z.literal(DEFAULT_SELECT_TARGETS.linkedin),
  }),
});
