import type { SongRecommendation } from "@/lib/ai/types";
import { seededRandom } from "@/lib/ai/mock-utils";

export interface MusicService {
  recommendSongs(input: { projectId: string; mood?: string }): Promise<SongRecommendation[]>;
}

const MOCK_CATALOG: SongRecommendation[] = [
  { name: "Sunset Lover", artist: "Petit Biscuit", reason: "warm, wide-open energy" },
  { name: "Golden", artist: "Harry Styles", reason: "bright, upbeat pacing" },
  { name: "Feels Like Summer", artist: "Childish Gambino", reason: "relaxed, sun-soaked mood" },
  { name: "Electric Feel", artist: "MGMT", reason: "nostalgic, motion-forward" },
  { name: "Ivy", artist: "Frank Ocean", reason: "intimate, reflective closer" },
  { name: "Sweater Weather", artist: "The Neighbourhood", reason: "moody, cinematic transitions" },
  { name: "Yellow", artist: "Coldplay", reason: "timeless, sentimental" },
  { name: "Location Unknown", artist: "Honne, THEY.", reason: "night-out, high energy" },
];

/**
 * Mocked implementation. Picks a deterministic, seeded subset of a small
 * static catalog. A real implementation would derive mood from the
 * project's photo analysis (time of day, scene labels, pace of the
 * carousel) and query a music API — this interface's shape doesn't need to
 * change for that.
 */
class MockMusicService implements MusicService {
  async recommendSongs(input: { projectId: string; mood?: string }): Promise<SongRecommendation[]> {
    const rng = seededRandom(input.projectId + (input.mood ?? ""));
    return [...MOCK_CATALOG].sort(() => rng() - 0.5).slice(0, 3);
  }
}

export const musicService: MusicService = new MockMusicService();
