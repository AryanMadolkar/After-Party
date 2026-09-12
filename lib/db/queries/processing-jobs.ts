import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { processingJobs, type ProcessingJobRow } from "@/db/schema";

export async function getProcessingJobById(jobId: string): Promise<ProcessingJobRow | null> {
  const [row] = await db
    .select()
    .from(processingJobs)
    .where(eq(processingJobs.id, jobId))
    .limit(1);
  return row ?? null;
}

export async function getProcessingJobForOrg(
  orgId: string,
  jobId: string,
): Promise<ProcessingJobRow | null> {
  const [row] = await db
    .select()
    .from(processingJobs)
    .where(and(eq(processingJobs.id, jobId), eq(processingJobs.orgId, orgId)))
    .limit(1);
  return row ?? null;
}
