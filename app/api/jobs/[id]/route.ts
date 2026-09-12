import { NextResponse } from "next/server";

import { ProcessingJobSchema } from "@/lib/contracts";
import { getProcessingJobById } from "@/lib/db/queries/processing-jobs";

type Params = { params: Promise<{ id: string }> };

/**
 * Contract example for later MSW (Solo-P5). Returns a ProcessingJob Zod shape
 * when the row exists; 404 otherwise. Auth/tenancy enforcement lands with upload.
 */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const row = await getProcessingJobById(id);
  if (!row) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const job = ProcessingJobSchema.parse({
    id: row.id,
    orgId: row.orgId,
    shootId: row.shootId,
    type: row.type,
    status: row.status,
    progressPct: row.progressPct,
    triggeredBy: row.triggeredBy,
    error: row.error,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    startedAt: row.startedAt,
    finishedAt: row.finishedAt,
  });

  return NextResponse.json(job);
}
