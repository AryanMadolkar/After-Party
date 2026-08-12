import type { Metadata } from "next";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { listProjectsWithStatsForUser } from "@/lib/db/queries/projects";
import { ProjectCard } from "@/components/dashboard/project-card";
import { DashboardEmptyState } from "@/components/dashboard/empty-state";

export const metadata: Metadata = {
  title: "Your projects",
};

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const projects = await listProjectsWithStatsForUser(user.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-serif text-3xl tracking-tight">Your projects</h1>

      {projects.length === 0 ? (
        <div className="mt-10">
          <DashboardEmptyState />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
