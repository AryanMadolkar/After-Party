import Link from "next/link";
import Image from "next/image";

import { formatRelativeTime } from "@/lib/utils";
import type { ProjectWithStats } from "@/lib/db/queries/projects";

const STATUS_LABEL: Record<ProjectWithStats["status"], string> = {
  draft: "draft",
  uploading: "uploading",
  processing: "analyzing",
  ready: "ready",
  failed: "needs attention",
};

export function ProjectCard({ project }: { project: ProjectWithStats }) {
  const showStatus = project.status !== "ready" && project.status !== "draft";

  const metaParts = [
    `${project.photoCount} ${project.photoCount === 1 ? "photo" : "photos"}`,
    project.postCount > 0 ? `${project.postCount} ${project.postCount === 1 ? "post" : "posts"}` : null,
    formatRelativeTime(project.createdAt),
  ].filter(Boolean);

  return (
    <Link href={`/app/project/${project.id}`} style={{ cursor: "pointer", background: "var(--ap-paper)", textDecoration: "none", color: "var(--ap-ink)" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", background: "var(--ap-sand)" }}>
          {project.coverThumbnailUrl && (
            <Image
              src={project.coverThumbnailUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        {showStatus && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "var(--ap-pink)",
              border: "2px solid var(--ap-ink)",
              padding: "3px 12px",
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            {STATUS_LABEL[project.status]}
          </span>
        )}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-archivo), sans-serif",
          fontWeight: 800,
          fontSize: 16,
          margin: "12px 12px 2px",
          textTransform: "uppercase",
        }}
      >
        {project.name}
      </h3>
      <p style={{ fontSize: 12, color: "var(--ap-ink-50)", margin: "0 12px 14px" }}>
        {metaParts.join(" · ")}
      </p>
    </Link>
  );
}
