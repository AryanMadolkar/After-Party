import type { CarouselResult, PhotoAnalysisResult, SelectionType } from "@/lib/ai/types";
import { rankingService } from "@/lib/ai/ranking";

export interface CarouselService {
  buildSelection(
    type: SelectionType,
    analyses: Array<{ photoId: string; analysis: PhotoAnalysisResult }>,
    options?: { targetCount?: number },
  ): Promise<CarouselResult>;
}

const DEFAULT_TARGET_COUNT: Record<SelectionType, number> = {
  best_photos: 10,
  carousel: 8,
  photo_dump: 15,
  friends: 8,
  couple: 6,
  aesthetic: 9,
  story: 5,
};

/**
 * Mocked implementation. Ranks photos with the (also mocked) ranking
 * service, then takes the top N for the requested selection type. The real
 * version will additionally enforce diversity across duplicate groups and
 * subject clusters — this interface's shape (type in, ordered ids out)
 * won't need to change when that lands.
 */
class MockCarouselService implements CarouselService {
  async buildSelection(
    type: SelectionType,
    analyses: Array<{ photoId: string; analysis: PhotoAnalysisResult }>,
    options?: { targetCount?: number },
  ): Promise<CarouselResult> {
    const targetCount = options?.targetCount ?? DEFAULT_TARGET_COUNT[type];
    const ranked = await rankingService.rankPhotos(analyses);
    const photoIds = ranked.slice(0, Math.min(targetCount, ranked.length)).map((r) => r.photoId);

    return {
      photoIds,
      reasoning: `Selected the ${photoIds.length} strongest photos for "${labelFor(type)}" based on quality, composition, and sharpness.`,
    };
  }
}

function labelFor(type: SelectionType): string {
  return type
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export const carouselService: CarouselService = new MockCarouselService();
