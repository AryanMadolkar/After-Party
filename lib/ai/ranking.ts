import type { PhotoAnalysisResult, RankedPhoto } from "@/lib/ai/types";

export interface RankingService {
  rankPhotos(
    analyses: Array<{ photoId: string; analysis: PhotoAnalysisResult }>,
  ): Promise<RankedPhoto[]>;
}

/**
 * Mocked implementation. Combines the mocked per-photo scores into a
 * single ranking score. A real ranking service will additionally factor in
 * embedding-based diversity (don't rank five near-duplicates back to back)
 * and duplicate-group suppression — the interface already anticipates that
 * by taking the full analysis, not just a single score.
 */
class MockRankingService implements RankingService {
  async rankPhotos(
    analyses: Array<{ photoId: string; analysis: PhotoAnalysisResult }>,
  ): Promise<RankedPhoto[]> {
    return analyses
      .map(({ photoId, analysis }) => ({
        photoId,
        score:
          analysis.qualityScore * 0.45 +
          analysis.compositionScore * 0.35 +
          analysis.blurScore * 0.2,
      }))
      .sort((a, b) => b.score - a.score);
  }
}

export const rankingService: RankingService = new MockRankingService();
