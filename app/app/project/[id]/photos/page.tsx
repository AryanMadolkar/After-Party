import Link from "next/link";
import type { Metadata } from "next";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { listPhotosPageForProject } from "@/lib/db/queries/photos";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "All photos",
};

export default async function ProjectPhotosPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const user = await requireCurrentUser();
  const { photos, total, pageSize } = await listPhotosPageForProject(id, user.id, page);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "photo" : "photos"}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      <PhotoGrid projectId={id} photos={photos} />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          {page > 1 ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`?page=${page - 1}`}>Previous</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
          )}
          {page < totalPages ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`?page=${page + 1}`}>Next</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
