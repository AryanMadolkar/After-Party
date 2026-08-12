import type { PhotoEmbedding, PhotoInput } from "@/lib/ai/types";
import { seededRandom } from "@/lib/ai/mock-utils";

const MOCK_EMBEDDING_DIMENSIONS = 32;

export interface EmbeddingService {
  embedPhoto(photo: PhotoInput): Promise<PhotoEmbedding>;
  embedPhotos(photos: PhotoInput[]): Promise<PhotoEmbedding[]>;
}

/**
 * Mocked implementation. Real embeddings will come from a vision model and
 * get stored in a vector index (or a pgvector column) — `photo_analysis`
 * only stores an `embedding_reference` pointer, never the vector itself,
 * so that swap doesn't require a schema change.
 */
class MockEmbeddingService implements EmbeddingService {
  async embedPhoto(photo: PhotoInput): Promise<PhotoEmbedding> {
    const rng = seededRandom(photo.id);
    const vector = Array.from({ length: MOCK_EMBEDDING_DIMENSIONS }, () => rng() * 2 - 1);
    return { photoId: photo.id, vector, reference: `mock:${photo.id}` };
  }

  async embedPhotos(photos: PhotoInput[]): Promise<PhotoEmbedding[]> {
    return Promise.all(photos.map((photo) => this.embedPhoto(photo)));
  }
}

export const embeddingService: EmbeddingService = new MockEmbeddingService();
