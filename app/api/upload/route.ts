import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { getProjectForUser } from "@/lib/db/queries/projects";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_ORIGINAL_FILE_SIZE_BYTES,
  MAX_THUMBNAIL_FILE_SIZE_BYTES,
  buildBlobPath,
} from "@/lib/storage/blob";

const clientPayloadSchema = z.object({
  projectId: z.string().uuid(),
  kind: z.enum(["originals", "thumbnails"]),
  filename: z.string().min(1).max(255),
});

/**
 * Issues short-lived, scoped upload tokens for direct browser -> Vercel Blob
 * uploads. Files never pass through this server's memory — the route only
 * authorizes the upload and (optionally) reacts once it's done. This is
 * what lets the app accept hundreds of photos without exhausting a
 * serverless function's memory or hitting request body limits.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const user = await requireCurrentUser();

        const parsedPayload = clientPayloadSchema.safeParse(
          clientPayload ? JSON.parse(clientPayload) : null,
        );
        if (!parsedPayload.success) {
          throw new Error("Invalid upload request.");
        }
        const { projectId, kind, filename } = parsedPayload.data;

        const project = await getProjectForUser(projectId, user.id);
        if (!project) {
          throw new Error("Project not found.");
        }

        const expectedPath = buildBlobPath({
          userId: user.id,
          projectId,
          kind,
          filename,
        });
        if (pathname !== expectedPath) {
          throw new Error("Upload path mismatch.");
        }

        return {
          allowedContentTypes: [...ALLOWED_IMAGE_MIME_TYPES],
          addRandomSuffix: false,
          maximumSizeInBytes:
            kind === "originals" ? MAX_ORIGINAL_FILE_SIZE_BYTES : MAX_THUMBNAIL_FILE_SIZE_BYTES,
          tokenPayload: JSON.stringify({ userId: user.id, projectId, kind }),
        };
      },
      onUploadCompleted: async () => {
        // Metadata rows are created by the client immediately after each
        // upload resolves (see lib/photos/upload.ts + the createPhoto
        // server action), which works identically in local dev and in
        // production. This hook is a good place to add server-side
        // confirmation/auditing later without touching the client flow.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload authorization failed." },
      { status: 400 },
    );
  }
}
