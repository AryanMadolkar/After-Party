import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { ProjectWithStats } from "@/lib/db/queries/projects";

const STATUS_LABEL: Record<ProjectWithStats["status"], string> = {
  draft: "Draft",
  uploading: "Uploading",
  processing: "Analyzing",
  ready: "Ready",
  failed: "Needs attention",
};

export function ProjectCard({ project }: { project: ProjectWithStats }) {
  return (
    <Link
      href={`/app/project/${project.id}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border/60 bg-muted">
        {project.coverThumbnailUrl ? (
          <Image
            src={project.coverThumbnailUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="size-8 text-muted-foreground/40" strokeWidth={1.25} />
          </div>
        )}

        {project.status !== "ready" && project.status !== "draft" && (
          <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur-sm">
            {STATUS_LABEL[project.status]}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="truncate font-serif text-lg tracking-tight">{project.name}</h3>
      </div>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {project.photoCount} {project.photoCount === 1 ? "photo" : "photos"}
        {project.postCount > 0 && (
          <>
            {" "}
            · {project.postCount} {project.postCount === 1 ? "post" : "posts"}
          </>
        )}
      </p>
    </Link>
  );
}
