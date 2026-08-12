import { notFound } from "next/navigation";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { getProjectForUser } from "@/lib/db/queries/projects";
import { ProjectHeader } from "@/components/project/project-header";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireCurrentUser();
  const project = await getProjectForUser(id, user.id);

  if (!project) notFound();

  return (
    <div>
      <ProjectHeader project={project} />
      <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
    </div>
  );
}
