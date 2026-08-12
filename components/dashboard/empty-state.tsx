import Link from "next/link";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-28 text-center">
      <Camera className="size-8 text-muted-foreground/50" strokeWidth={1.25} />
      <h2 className="mt-6 font-serif text-2xl tracking-tight">Your next post starts here.</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Upload the photos from your trip or event and After Party will find the ones worth
        posting.
      </p>
      <Button asChild size="lg" className="mt-8 rounded-full px-6">
        <Link href="/app/new">Create a project</Link>
      </Button>
    </div>
  );
}
