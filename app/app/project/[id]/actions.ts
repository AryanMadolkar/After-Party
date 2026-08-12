"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { getProjectForUser } from "@/lib/db/queries/projects";
import { getPhotoForUser, listAnalysisForProject, listPhotosForProject } from "@/lib/db/queries/photos";
import { deletePhotoForUser } from "@/lib/db/mutations/photos";
import { deletePhotoBlobs } from "@/lib/storage/delete-photo-assets";
import {
  addPhotoToSelection,
  createSelectionWithPhotos,
  removePhotoFromSelection,
  reorderSelectionPhotos,
} from "@/lib/db/mutations/selections";
import { getSelectionForUser, listSelectionPhotos } from "@/lib/db/queries/selections";
import { createCaptionForProject } from "@/lib/db/mutations/captions";
import { createPostForProject } from "@/lib/db/mutations/posts";
import { carouselService } from "@/lib/ai/carousel";
import { captionService } from "@/lib/ai/captions";
import { musicService } from "@/lib/ai/music";
import { aiEditorService } from "@/lib/ai/editor";
import type { CaptionStyle, SelectionType } from "@/db/schema";

async function assertProjectOwnership(projectId: string) {
  const user = await requireCurrentUser();
  const project = await getProjectForUser(projectId, user.id);
  if (!project) throw new Error("Project not found.");
  return { user, project };
}

const deletePhotoSchema = z.object({ projectId: z.string().uuid(), photoId: z.string().uuid() });

export async function deletePhotoAction(input: z.infer<typeof deletePhotoSchema>) {
  const { photoId, projectId } = deletePhotoSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);

  const photo = await getPhotoForUser(photoId, user.id);
  if (!photo) throw new Error("Photo not found.");

  await deletePhotoForUser(photoId, user.id);
  await deletePhotoBlobs([photo.blobUrl, photo.thumbnailUrl]);

  revalidatePath(`/app/project/${projectId}`);
  revalidatePath(`/app/project/${projectId}/photos`);
}

const selectionTypeSchema = z.enum([
  "best_photos",
  "carousel",
  "photo_dump",
  "friends",
  "couple",
  "aesthetic",
  "story",
]) satisfies z.ZodType<SelectionType>;

const buildSelectionSchema = z.object({
  projectId: z.string().uuid(),
  type: selectionTypeSchema,
});

/**
 * Runs the (mocked) selection algorithm for a given post type and persists
 * the result. This is the seam the real AI selection engine will replace —
 * everything downstream (carousel editor, posts) only depends on
 * `selections` / `selection_photos` rows, not on how they were produced.
 */
export async function buildSelectionAction(input: z.infer<typeof buildSelectionSchema>) {
  const { projectId, type } = buildSelectionSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);

  const [photos, analysisByPhoto] = await Promise.all([
    listPhotosForProject(projectId, user.id),
    listAnalysisForProject(projectId, user.id),
  ]);

  if (photos.length === 0) throw new Error("This project has no photos yet.");

  const analyses = photos.map((photo) => {
    const analysis = analysisByPhoto[photo.id];
    return {
      photoId: photo.id,
      analysis: {
        qualityScore: analysis?.qualityScore ?? 50,
        compositionScore: analysis?.compositionScore ?? 50,
        blurScore: analysis?.blurScore ?? 50,
        faces: analysis?.faceCount ?? 0,
        labels: analysis?.labels ?? [],
        objects: analysis?.objects ?? [],
        duplicateGroup: analysis?.duplicateGroup ?? null,
      },
    };
  });

  const result = await carouselService.buildSelection(type, analyses);

  const selection = await createSelectionWithPhotos({
    projectId,
    userId: user.id,
    type,
    photos: result.photoIds.map((photoId, index) => ({ photoId, position: index })),
  });

  revalidatePath(`/app/project/${projectId}/create`);
  return { selectionId: selection.id, photoIds: result.photoIds, reasoning: result.reasoning };
}

const selectionMutationSchema = z.object({
  selectionId: z.string().uuid(),
  projectId: z.string().uuid(),
});

export async function getSelectionPhotosAction(input: z.infer<typeof selectionMutationSchema>) {
  const { selectionId, projectId } = selectionMutationSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);

  const selection = await getSelectionForUser(selectionId, user.id);
  if (!selection) throw new Error("Selection not found.");

  return listSelectionPhotos(selectionId);
}

const reorderSchema = selectionMutationSchema.extend({
  photoIds: z.array(z.string().uuid()),
});

export async function reorderSelectionAction(input: z.infer<typeof reorderSchema>) {
  const { selectionId, projectId, photoIds } = reorderSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);
  await reorderSelectionPhotos(selectionId, user.id, photoIds);
  revalidatePath(`/app/project/${projectId}/create`);
}

const selectionPhotoSchema = selectionMutationSchema.extend({ photoId: z.string().uuid() });

export async function removeFromSelectionAction(input: z.infer<typeof selectionPhotoSchema>) {
  const { selectionId, projectId, photoId } = selectionPhotoSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);
  await removePhotoFromSelection(selectionId, user.id, photoId);
  revalidatePath(`/app/project/${projectId}/create`);
}

const addToSelectionSchema = selectionPhotoSchema.extend({ position: z.number().int().min(0) });

export async function addToSelectionAction(input: z.infer<typeof addToSelectionSchema>) {
  const { selectionId, projectId, photoId, position } = addToSelectionSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);
  await addPhotoToSelection(selectionId, user.id, photoId, position);
  revalidatePath(`/app/project/${projectId}/create`);
}

const captionStyleSchema = z.enum([
  "minimal",
  "funny",
  "story",
  "casual",
  "romantic",
  "none",
]) satisfies z.ZodType<CaptionStyle>;

const generateCaptionsSchema = z.object({
  projectId: z.string().uuid(),
  style: captionStyleSchema,
});

export async function generateCaptionsAction(input: z.infer<typeof generateCaptionsSchema>) {
  const { projectId, style } = generateCaptionsSchema.parse(input);
  const { project } = await assertProjectOwnership(projectId);
  return captionService.generateCaptions({ projectName: project.name, style, count: 3 });
}

const saveCaptionSchema = z.object({
  projectId: z.string().uuid(),
  text: z.string().min(1).max(2200),
  style: captionStyleSchema,
});

export async function saveCaptionAction(input: z.infer<typeof saveCaptionSchema>) {
  const { projectId, text, style } = saveCaptionSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);
  const caption = await createCaptionForProject({ projectId, userId: user.id, text, style });
  revalidatePath(`/app/project/${projectId}/create`);
  return { id: caption.id };
}

const recommendSongsSchema = z.object({ projectId: z.string().uuid() });

export async function recommendSongsAction(input: z.infer<typeof recommendSongsSchema>) {
  const { projectId } = recommendSongsSchema.parse(input);
  await assertProjectOwnership(projectId);
  return musicService.recommendSongs({ projectId });
}

const createPostSchema = z.object({
  projectId: z.string().uuid(),
  type: selectionTypeSchema,
  caption: z.string().max(2200).nullable(),
  songName: z.string().max(200).nullable(),
  songArtist: z.string().max(200).nullable(),
});

export async function createPostAction(input: z.infer<typeof createPostSchema>) {
  const { projectId, type, caption, songName, songArtist } = createPostSchema.parse(input);
  const { user } = await assertProjectOwnership(projectId);

  const post = await createPostForProject({
    projectId,
    userId: user.id,
    type,
    caption,
    songName,
    songArtist,
  });

  revalidatePath(`/app/project/${projectId}`);
  return { id: post.id };
}

const applyEditSchema = z.object({
  projectId: z.string().uuid(),
  photoUrl: z.string().url(),
  prompt: z.string().min(1).max(500),
});

export async function applyAiEditAction(input: z.infer<typeof applyEditSchema>) {
  const { projectId, photoUrl, prompt } = applyEditSchema.parse(input);
  await assertProjectOwnership(projectId);
  return aiEditorService.applyEditPrompt({ photoUrl, prompt });
}
