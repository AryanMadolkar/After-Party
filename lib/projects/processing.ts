import "server-only";

import { listPhotosForProject } from "@/lib/db/queries/photos";
import { upsertPhotoAnalysis } from "@/lib/db/mutations/photos";
import { updateProjectForUser } from "@/lib/db/mutations/projects";
import { photoAnalyzer } from "@/lib/ai/analyzer";

/**
 * Runs the (mocked) analysis pass over every photo in a project and flips
 * the project to "ready" once done.
 *
 * This stands in for what will eventually be an asynchronous, queued
 * pipeline (thumbnails -> hashing -> vision analysis -> embeddings ->
 * clustering -> ranking). Because the analyzer is mocked and fast, it's
 * safe to run inline from a server action for now; the call site
 * (`analyzeProjectAction`) is written so swapping this for
 * "enqueue a background job" later is a one-line change.
 */
export async function processProjectPhotos(projectId: string, userId: string): Promise<void> {
  await updateProjectForUser(projectId, userId, { status: "processing" });

  try {
    const photos = await listPhotosForProject(projectId, userId);

    const analyses = await photoAnalyzer.analyzePhotos(
      photos.map((photo) => ({
        id: photo.id,
        thumbnailUrl: photo.thumbnailUrl ?? photo.blobUrl,
        width: photo.width,
        height: photo.height,
        exifData: photo.exifData,
      })),
    );

    await Promise.all(
      photos.map((photo) => {
        const analysis = analyses.get(photo.id);
        if (!analysis) return Promise.resolve();
        return upsertPhotoAnalysis({
          photoId: photo.id,
          qualityScore: analysis.qualityScore,
          blurScore: analysis.blurScore,
          compositionScore: analysis.compositionScore,
          faceCount: analysis.faces,
          labels: analysis.labels,
          objects: analysis.objects,
          duplicateGroup: analysis.duplicateGroup,
          analysis: analysis as unknown as Record<string, unknown>,
        });
      }),
    );

    await updateProjectForUser(projectId, userId, { status: "ready" });
  } catch (error) {
    await updateProjectForUser(projectId, userId, { status: "failed" });
    throw error;
  }
}
