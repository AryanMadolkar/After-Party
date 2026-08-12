import type { Metadata } from "next";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { listPhotosForProject } from "@/lib/db/queries/photos";
import { EditorShell } from "@/components/editor/editor-shell";

export const metadata: Metadata = {
  title: "Edit",
};

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireCurrentUser();
  const photos = await listPhotosForProject(id, user.id);

  return (
    <EditorShell
      projectId={id}
      photos={photos.map((photo) => ({
        id: photo.id,
        thumbnailUrl: photo.thumbnailUrl ?? photo.blobUrl,
        blobUrl: photo.blobUrl,
      }))}
    />
  );
}
