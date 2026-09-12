import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { processingJobs, type NewProcessingJob, type ProcessingJobRow } from "@/db/schema";

export async function createProcessingJobRow(
  input: Pick<NewProcessingJob, "orgId" | "shootId" | "type" | "triggeredBy" | "payload"> & {
    status?: NewProcessingJob["status"];
  },
): Promise<ProcessingJobRow> {
  const [row] = await db
    .insert(processingJobs)
    .values({
      orgId: input.orgId,
      shootId: input.shootId,
      type: input.type,
      triggeredBy: input.triggeredBy ?? null,
      payload: input.payload ?? null,
      status: input.status ?? "queued",
      progressPct: 0,
    })
    .returning();
  return row;
}

export async function updateProcessingJobProgress(
  jobId: string,
  progressPct: number,
  status?: ProcessingJobRow["status"],
): Promise<ProcessingJobRow | null> {
  const [row] = await db
    .update(processingJobs)
    .set({
      progressPct,
      status: status ?? "running",
      updatedAt: new Date(),
      ...(progressPct > 0 && status !== "queued" ? { startedAt: new Date() } : {}),
    })
    .where(eq(processingJobs.id, jobId))
    .returning();
  return row ?? null;
}

export async function completeProcessingJob(
  jobId: string,
  outcome: "succeeded" | "failed",
  error?: string | null,
): Promise<ProcessingJobRow | null> {
  const [row] = await db
    .update(processingJobs)
    .set({
      status: outcome,
      progressPct: outcome === "succeeded" ? 100 : undefined,
      error: error ?? null,
      finishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(processingJobs.id, jobId))
    .returning();
  return row ?? null;
}
