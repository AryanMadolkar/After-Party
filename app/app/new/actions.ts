"use server";

import { z } from "zod";

import { requireCurrentUser } from "@/lib/auth/current-user";
import {
  createProject,
  incrementProjectPhotoCount,
  updateProjectForUser,
} from "@/lib/db/mutations/projects";
import { createPhoto } from "@/lib/db/mutations/photos";
import { getProjectForUser } from "@/lib/db/queries/projects";
import { processProjectPhotos } from "@/lib/projects/processing";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_PHOTOS_PER_PROJECT } from "@/lib/storage/blob";

const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Give your project a name.").max(120),
});

export async function createProjectAction(input: { name: string }) {
  const user = await requireCurrentUser();
  const { name } = createProjectSchema.parse(input);

  const project = await createProject({ userId: user.id, name });
  return { id: project.id };
}

const createPhotoSchema = z.object({
  projectId: z.string().uuid(),
  blobUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  originalFilename: z.string().min(1).max(255),
  mimeType: z.string().refine((value) => (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(value) || value === "application/octet-stream", "Unsupported file type."),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  fileSize: z.number().int().positive(),
  exifData: z.record(z.string(), z.unknown()).nullable(),
});

export async function createPhotoAction(input: z.infer<typeof createPhotoSchema>) {
  const user = await requireCurrentUser();
  const data = createPhotoSchema.parse(input);

  const project = await getProjectForUser(data.projectId, user.id);
  if (!project) throw new Error("Project not found.");
  if (project.photoCount >= MAX_PHOTOS_PER_PROJECT) {
    throw new Error(`Projects are limited to ${MAX_PHOTOS_PER_PROJECT} photos.`);
  }

  const photo = await createPhoto({
    projectId: data.projectId,
    userId: user.id,
    blobUrl: data.blobUrl,
    thumbnailUrl: data.thumbnailUrl,
    originalFilename: data.originalFilename,
    mimeType: data.mimeType,
    width: data.width,
    height: data.height,
    fileSize: data.fileSize,
    exifData: data.exifData ?? undefined,
  });

  await incrementProjectPhotoCount(data.projectId, user.id, 1);

  return { id: photo.id };
}

export async function markProjectUploadedAction(projectId: z.infer<typeof createPhotoSchema>["projectId"]) {
  const user = await requireCurrentUser();
  await updateProjectForUser(projectId, user.id, { status: "processing" });
}

const analyzeSchema = z.object({ projectId: z.string().uuid() });

/**
 * Kicks off the (mocked) analysis pipeline. Currently runs inline; the
 * real implementation should enqueue a background job here instead and
 * let the UI poll/subscribe for the status change.
 */
export async function analyzeProjectAction(input: { projectId: string }) {
  const user = await requireCurrentUser();
  const { projectId } = analyzeSchema.parse(input);

  const project = await getProjectForUser(projectId, user.id);
  if (!project) throw new Error("Project not found.");

  await processProjectPhotos(projectId, user.id);
  return { status: "ready" as const };
}
