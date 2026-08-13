import Link from "next/link";
import type { Metadata } from "next";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { getDashboardStats, listProjectsWithStatsForUser } from "@/lib/db/queries/projects";
import { ProjectCard } from "@/components/dashboard/project-card";
import { DashboardEmptyState } from "@/components/dashboard/empty-state";
import type { SelectionType } from "@/db/schema";

export const metadata: Metadata = {
  title: "Your projects",
};

const QUICK_MODES: Array<{ label: string; type: SelectionType; tone: string }> = [
  { label: "Best Photos", type: "best_photos", tone: "var(--ap-lime)" },
  { label: "Carousel", type: "carousel", tone: "var(--ap-pink)" },
  { label: "Photo Dump", type: "photo_dump", tone: "var(--ap-sand)" },
  { label: "Friends", type: "friends", tone: "var(--ap-lime)" },
  { label: "Couple", type: "couple", tone: "var(--ap-pink)" },
  { label: "Aesthetic", type: "aesthetic", tone: "var(--ap-sand)" },
  { label: "Story", type: "story", tone: "var(--ap-lime)" },
];

const STAT_LABELS: Array<{ key: keyof Awaited<ReturnType<typeof getDashboardStats>>; label: string }> = [
  { key: "activeProjects", label: "active" },
  { key: "photosAnalyzed", label: "analyzed" },
  { key: "posts", label: "posts" },
  { key: "songsPicked", label: "songs" },
];

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const [projects, stats] = await Promise.all([
    listProjectsWithStatsForUser(user.id),
    getDashboardStats(user.id),
  ]);

  return (
    <div className="ap-scope" style={{ minHeight: "100%" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(20px,5vw,56px)" }}>
        <div
          style={{
            padding: "36px 0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-archivo), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(30px,3.8vw,46px)",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
            }}
          >
            your projects
          </h1>
          {projects.length > 0 && (
            <div style={{ display: "flex", border: "2px solid var(--ap-ink)" }}>
              {STAT_LABELS.map(({ key, label }) => (
                <div key={key} style={{ padding: "10px 18px", borderRight: "2px solid var(--ap-ink)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, fontSize: 20 }}>
                    {stats[key].toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", color: "var(--ap-ink-50)" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {projects.length > 0 && (
          <div style={{ padding: "8px 0 30px", borderTop: "2px solid var(--ap-ink)" }}>
            <h4
              style={{
                fontFamily: "var(--font-archivo), sans-serif",
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: "0.03em",
                color: "var(--ap-ink-50)",
                margin: "22px 0 12px",
                textTransform: "uppercase",
              }}
            >
              quick start a post type
            </h4>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {QUICK_MODES.map((mode) => (
                <Link
                  key={mode.type}
                  href="/app/new"
                  className="ap-flash"
                  style={{
                    background: mode.tone,
                    border: "2px solid var(--ap-ink)",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "8px 16px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    color: "var(--ap-ink)",
                  }}
                >
                  {mode.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "16px 0 72px" }}>
          {projects.length === 0 ? (
            <DashboardEmptyState />
          ) : (
            <div
              className="ap-project-grid"
              style={{
                display: "grid",
                gap: 2,
                background: "var(--ap-ink)",
                border: "2px solid var(--ap-ink)",
              }}
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              <Link
                href="/app/new"
                style={{
                  background: "var(--ap-paper)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  aspectRatio: "4/5",
                  textDecoration: "none",
                  color: "var(--ap-ink)",
                }}
              >
                <span style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, fontSize: 32 }}>
                  +
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>new project</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
