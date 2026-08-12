"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/app/project/${projectId}`;

  const tabs = [
    { label: "Overview", href: base },
    { label: "Photos", href: `${base}/photos` },
    { label: "Create", href: `${base}/create` },
    { label: "Edit", href: `${base}/edit` },
  ];

  return (
    <nav className="flex gap-6 border-b border-border/60">
      {tabs.map((tab) => {
        const isActive = tab.href === base ? pathname === base : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative py-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
              isActive && "text-foreground",
            )}
          >
            {tab.label}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-px bg-foreground" />}
          </Link>
        );
      })}
    </nav>
  );
}
