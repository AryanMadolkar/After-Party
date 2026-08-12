import type { CaptionStyle, SelectionType } from "@/db/schema";

/**
 * Shared types for every AI service interface. The rest of the app depends
 * on these interfaces — never directly on an OpenAI/Gemini SDK — so the
 * mock implementations here can be swapped for real ones later without
 * touching any calling code.
 */

export type PhotoInput = {
  id: string;
  thumbnailUrl: string;
  width: number | null;
  height: number | null;
  exifData: Record<string, unknown> | null;
};

export type PhotoAnalysisResult = {
  qualityScore: number; // 0-100
  compositionScore: number; // 0-100
  blurScore: number; // 0-100, higher = sharper
  faces: number;
  labels: string[];
  objects: string[];
  duplicateGroup: string | null;
};

export type PhotoEmbedding = {
  photoId: string;
  vector: number[];
  reference: string;
};

export type RankedPhoto = {
  photoId: string;
  score: number;
};

export type CarouselResult = {
  photoIds: string[];
  reasoning: string;
};

export type SongRecommendation = {
  name: string;
  artist: string;
  reason: string;
};

export type EditResult = {
  previewUrl: string;
  summary: string;
  appliedAdjustments: Partial<Record<EditAdjustmentKey, number>>;
};

export type EditAdjustmentKey =
  | "brightness"
  | "contrast"
  | "highlights"
  | "shadows"
  | "saturation"
  | "temperature"
  | "sharpness"
  | "rotate";

export type { CaptionStyle, SelectionType };
