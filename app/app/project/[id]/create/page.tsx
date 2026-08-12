import type { Metadata } from "next";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { listPhotosForProject } from "@/lib/db/queries/photos";
import { CreatePostClient } from "@/app/app/project/[id]/create/create-post-client";
import type { SelectionType } from "@/db/schema";

export const metadata: Metadata = {
  title: "Create post",
};

const VALID_TYPES: SelectionType[] = [
  "best_photos",
  "carousel",
  "photo_dump",
  "friends",
  "couple",
  "aesthetic",
  "story",
];

export default async function CreatePostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const { type } = await searchParams;
  const user = await requireCurrentUser();

  const photos = await listPhotosForProject(id, user.id);
  const poolPhotos = photos.map((photo) => ({
    id: photo.id,
    thumbnailUrl: photo.thumbnailUrl ?? photo.blobUrl,
    blobUrl: photo.blobUrl,
  }));

  const initialType = VALID_TYPES.includes(type as SelectionType)
    ? (type as SelectionType)
    : undefined;

  return (
    <CreatePostClient projectId={id} poolPhotos={poolPhotos} initialType={initialType} />
  );
}
