import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { getProjectForUser } from "@/lib/db/queries/projects";
import { listPhotosForProject } from "@/lib/db/queries/photos";
import { listSelectionsForProject, listSelectionPhotos } from "@/lib/db/queries/selections";
import { DashboardEmptyState } from "@/components/dashboard/empty-state";
import { SectionRow } from "@/components/project/section-row";
import { Button } from "@/components/ui/button";
import { analyzeProjectAction } from "@/app/app/new/actions";
import type { SelectionType } from "@/db/schema";

const SECTIONS: Array<{ type: SelectionType; title: string; emptyLabel: string }> = [
  { type: "best_photos", title: "Best Photos", emptyLabel: "Find your best photos" },
  { type: "carousel", title: "Carousel", emptyLabel: "Build a carousel" },
  { type: "photo_dump", title: "Photo Dump", emptyLabel: "Build a photo dump" },
  { type: "story", title: "Stories", emptyLabel: "Build a story" },
];

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireCurrentUser();
  const project = await getProjectForUser(id, user.id);
  if (!project) return null; // layout already calls notFound()

  if (project.status === "processing" || project.status === "uploading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Analyzing your photos...</p>
      </div>
    );
  }

  if (project.status === "failed") {
    async function retryAnalysis() {
      "use server";
      await analyzeProjectAction({ projectId: id });
    }

    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="size-6 text-destructive" />
        <p className="mt-4 text-muted-foreground">
          Something went wrong while analyzing your photos.
        </p>
        <form action={retryAnalysis} className="mt-6">
          <Button type="submit" variant="outline">
            Try again
          </Button>
        </form>
      </div>
    );
  }

  if (project.photoCount === 0) {
    return <DashboardEmptyState />;
  }

  const [photos, selections] = await Promise.all([
    listPhotosForProject(id, user.id),
    listSelectionsForProject(id, user.id),
  ]);

  const photoById = new Map(photos.map((photo) => [photo.id, photo]));

  const latestSelectionByType = new Map<SelectionType, string>();
  for (const selection of selections) {
    if (!latestSelectionByType.has(selection.type)) {
      latestSelectionByType.set(selection.type, selection.id);
    }
  }

  const thumbnailsByType = new Map<SelectionType, string[]>();
  await Promise.all(
    SECTIONS.map(async ({ type }) => {
      const selectionId = latestSelectionByType.get(type);
      if (!selectionId) {
        thumbnailsByType.set(type, []);
        return;
      }
      const selectionPhotos = await listSelectionPhotos(selectionId);
      const urls = selectionPhotos
        .map((sp) => photoById.get(sp.photoId)?.thumbnailUrl ?? photoById.get(sp.photoId)?.blobUrl)
        .filter((url): url is string => Boolean(url));
      thumbnailsByType.set(type, urls);
    }),
  );

  return (
    <div className="space-y-14">
      {SECTIONS.map(({ type, title, emptyLabel }) => (
        <SectionRow
          key={type}
          title={title}
          href={`/app/project/${id}/create?type=${type}`}
          thumbnails={thumbnailsByType.get(type) ?? []}
          emptyLabel={emptyLabel}
        />
      ))}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl tracking-tight">All Photos</h2>
          <Link
            href={`/app/project/${id}/photos`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all {project.photoCount}
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8">
          {photos.slice(0, 16).map((photo) => (
            <Link
              key={photo.id}
              href={`/app/project/${id}/photos`}
              className="relative aspect-square overflow-hidden rounded-md bg-muted"
            >
              <Image
                src={photo.thumbnailUrl ?? photo.blobUrl}
                alt=""
                fill
                loading="lazy"
                sizes="120px"
                className="object-cover"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
