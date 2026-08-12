import type { PhotoAnalysisResult, PhotoInput } from "@/lib/ai/types";
import { seededRandom } from "@/lib/ai/mock-utils";

export interface PhotoAnalyzer {
  analyzePhoto(photo: PhotoInput): Promise<PhotoAnalysisResult>;
  analyzePhotos(photos: PhotoInput[]): Promise<Map<string, PhotoAnalysisResult>>;
}

const MOCK_LABEL_POOL = [
  "outdoors",
  "golden hour",
  "group photo",
  "candid",
  "landscape",
  "portrait",
  "night",
  "architecture",
  "food",
  "beach",
  "city",
  "close-up",
];

const MOCK_OBJECT_POOL = ["person", "sky", "building", "water", "tree", "food", "car", "phone"];

/**
 * Mocked implementation. Deterministic per photo id (via a seeded PRNG)
 * so the UI doesn't flicker with different fake scores on every render —
 * swap this module's export for a real vision-model-backed implementation
 * once the analysis pipeline is built; nothing else in the app needs to
 * change.
 */
class MockPhotoAnalyzer implements PhotoAnalyzer {
  async analyzePhoto(photo: PhotoInput): Promise<PhotoAnalysisResult> {
    const rng = seededRandom(photo.id);

    return {
      qualityScore: Math.round(55 + rng() * 45),
      compositionScore: Math.round(50 + rng() * 50),
      blurScore: Math.round(60 + rng() * 40),
      faces: Math.floor(rng() * 5),
      labels: pickSample(MOCK_LABEL_POOL, rng, 2 + Math.floor(rng() * 2)),
      objects: pickSample(MOCK_OBJECT_POOL, rng, 1 + Math.floor(rng() * 3)),
      duplicateGroup: null,
    };
  }

  async analyzePhotos(photos: PhotoInput[]): Promise<Map<string, PhotoAnalysisResult>> {
    const results = await Promise.all(
      photos.map(async (photo) => [photo.id, await this.analyzePhoto(photo)] as const),
    );
    return new Map(results);
  }
}

function pickSample<T>(pool: T[], rng: () => number, count: number): T[] {
  const shuffled = [...pool].sort(() => rng() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

export const photoAnalyzer: PhotoAnalyzer = new MockPhotoAnalyzer();
