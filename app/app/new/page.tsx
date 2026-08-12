import type { Metadata } from "next";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { NewProjectFlow } from "@/components/upload/new-project-flow";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  const user = await requireCurrentUser();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-serif text-3xl tracking-tight">New project</h1>
      <p className="mt-2 text-muted-foreground">
        Upload the photos from your trip or event — After Party will find the ones worth
        posting.
      </p>

      <div className="mt-10">
        <NewProjectFlow userId={user.id} />
      </div>
    </div>
  );
}
