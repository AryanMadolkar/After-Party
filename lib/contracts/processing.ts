import { z } from "zod";

export const ProcessingJobTypeEnum = z.enum([
  "full_pipeline",
  "generate_captions",
  "build_export",
  "score_assets",
  "hello",
]);
export type ProcessingJobType = z.infer<typeof ProcessingJobTypeEnum>;

export const ProcessingJobStatusEnum = z.enum([
  "queued",
  "running",
  "succeeded",
  "failed",
]);
export type ProcessingJobStatus = z.infer<typeof ProcessingJobStatusEnum>;

export const ProcessingJobPayloadSchema = z.object({
  orgId: z.string().uuid(),
  shootId: z.string().uuid(),
  jobId: z.string().uuid().optional(),
  type: ProcessingJobTypeEnum,
  triggeredBy: z.string().uuid().optional(),
});
export type ProcessingJobPayload = z.infer<typeof ProcessingJobPayloadSchema>;

export const ProcessingJobSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  shootId: z.string().uuid(),
  type: ProcessingJobTypeEnum,
  status: ProcessingJobStatusEnum,
  progressPct: z.number().int().min(0).max(100),
  triggeredBy: z.string().uuid().nullable(),
  error: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  startedAt: z.coerce.date().nullable(),
  finishedAt: z.coerce.date().nullable(),
});
export type ProcessingJob = z.infer<typeof ProcessingJobSchema>;

export const ProgressEventSchema = z.object({
  orgId: z.string().uuid(),
  shootId: z.string().uuid(),
  jobId: z.string().uuid(),
  progressPct: z.number().int().min(0).max(100),
  stage: z.string().min(1).optional(),
  message: z.string().optional(),
  at: z.coerce.date().optional(),
});
export type ProgressEvent = z.infer<typeof ProgressEventSchema>;
