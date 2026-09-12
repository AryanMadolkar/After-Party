import { z } from "zod";

/** Per-asset quality score from ScoreQuality. */
export const AssetScorePayloadSchema = z.object({
  assetId: z.string().uuid(),
  orgId: z.string().uuid(),
  shootId: z.string().uuid(),
  quality: z.number().min(0).max(1),
  sharpness: z.number().min(0).max(1).optional(),
  exposure: z.number().min(0).max(1).optional(),
  faces: z.number().int().min(0).optional(),
  labels: z.array(z.string()).default([]),
  model: z.string().optional(),
});
export type AssetScorePayload = z.infer<typeof AssetScorePayloadSchema>;

/** Brand-fit score from ScoreBrand. */
export const BrandScorePayloadSchema = z.object({
  assetId: z.string().uuid(),
  orgId: z.string().uuid(),
  shootId: z.string().uuid(),
  clientId: z.string().uuid().optional(),
  brandFit: z.number().min(0).max(1),
  paletteMatch: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
  model: z.string().optional(),
});
export type BrandScorePayload = z.infer<typeof BrandScorePayloadSchema>;

export const CaptionPayloadSchema = z.object({
  assetId: z.string().uuid().optional(),
  orgId: z.string().uuid(),
  shootId: z.string().uuid(),
  locale: z.enum(["en", "hi"]),
  text: z.string().min(1),
  tone: z.string().optional(),
  model: z.string().optional(),
});
export type CaptionPayload = z.infer<typeof CaptionPayloadSchema>;
