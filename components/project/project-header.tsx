import { Badge } from "@/components/ui/badge";
import { ProjectTabs } from "@/components/project/project-tabs";
import type { Project } from "@/db/schema";

const STATUS_LABEL: Record<Project["status"], string> = {
  draft: "Draft",
  uploading: "Uploading",
  processing: "Analyzing",
  ready: "Ready",
  failed: "Needs attention",
};

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl tracking-tight">{project.name}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {project.photoCount} {project.photoCount === 1 ? "photo" : "photos"}
            </p>
          </div>
          <Badge
            variant={project.status === "ready" ? "default" : "secondary"}
            className="rounded-full px-3 py-1"
          >
            {STATUS_LABEL[project.status]}
          </Badge>
        </div>

        <div className="mt-6">
          <ProjectTabs projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
