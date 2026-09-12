import { randomUUID } from "node:crypto";

import { inngest } from "@/lib/inngest/client";
import { ProcessingJobPayloadSchema, ProgressEventSchema } from "@/lib/contracts";
import { createLogger } from "@/lib/observability/logger";
import { captureException, initSentry } from "@/lib/observability/sentry";
import { funnel } from "@/lib/observability/funnel";
import { getCutRoomAi } from "@/lib/ai/cutroom";

function resolveJobId(jobId: string | undefined): string {
  if (jobId) return jobId;
  return randomUUID();
}

/**
 * Hello / progress smoke job: walks progressPct 0→100 with structured logs.
 * Payload: { orgId, shootId, jobId? }.
 */
export const helloPipeline = inngest.createFunction(
  { id: "cutroom-hello-pipeline", name: "CutRoom hello pipeline" },
  { event: "cutroom/pipeline.hello" },
  async ({ event, step }) => {
    initSentry();
    const payload = ProcessingJobPayloadSchema.parse({
      ...event.data,
      type: (event.data as { type?: string }).type ?? "hello",
    });
    const jobId = resolveJobId(payload.jobId);
    const log = createLogger({
      orgId: payload.orgId,
      shootId: payload.shootId,
      jobId,
    });

    log.info("hello_pipeline.started", { type: payload.type });

    const stages = [
      { pct: 0, stage: "queued" },
      { pct: 25, stage: "score_quality" },
      { pct: 50, stage: "score_brand" },
      { pct: 75, stage: "generate_caption" },
      { pct: 100, stage: "done" },
    ] as const;

    const ai = getCutRoomAi();
    const demoAssetId = "11111111-1111-4111-8111-111111111111";

    try {
      for (const { pct, stage } of stages) {
        await step.run(`progress-${pct}`, async () => {
          const progress = ProgressEventSchema.parse({
            orgId: payload.orgId,
            shootId: payload.shootId,
            jobId,
            progressPct: pct,
            stage,
            message: `Hello pipeline ${stage}`,
            at: new Date(),
          });
          log.info("hello_pipeline.progress", {
            progressPct: progress.progressPct,
            stage: progress.stage,
          });

          if (stage === "score_quality") {
            await ai.scoreQuality.score({
              orgId: payload.orgId,
              shootId: payload.shootId,
              assetId: demoAssetId,
            });
          }
          if (stage === "score_brand") {
            await ai.scoreBrand.score({
              orgId: payload.orgId,
              shootId: payload.shootId,
              assetId: demoAssetId,
            });
          }
          if (stage === "generate_caption") {
            await ai.generateCaption.generate({
              orgId: payload.orgId,
              shootId: payload.shootId,
              assetId: demoAssetId,
              locale: "en",
            });
          }

          return progress;
        });
      }

      funnel.processingCompleted(payload.orgId, payload.shootId, jobId, {
        type: "hello",
      });
      log.info("hello_pipeline.succeeded", { progressPct: 100 });
      return { ok: true as const, jobId, progressPct: 100 };
    } catch (error) {
      log.error("hello_pipeline.failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      captureException(error, {
        orgId: payload.orgId,
        shootId: payload.shootId,
        jobId,
      });
      throw error;
    }
  },
);

/**
 * Full shoot pipeline stub — same progress contract; real work in P5+.
 */
export const processShootPipeline = inngest.createFunction(
  { id: "cutroom-process-shoot", name: "CutRoom process shoot pipeline" },
  { event: "cutroom/pipeline.process-shoot" },
  async ({ event, step }) => {
    initSentry();
    const payload = ProcessingJobPayloadSchema.parse(event.data);
    const jobId = resolveJobId(payload.jobId);
    const log = createLogger({
      orgId: payload.orgId,
      shootId: payload.shootId,
      jobId,
    });

    log.info("process_shoot.started", { type: payload.type });

    await step.run("progress-0", async () => {
      log.info("process_shoot.progress", { progressPct: 0, stage: "queued" });
      return 0;
    });

    await step.run("progress-50", async () => {
      log.info("process_shoot.progress", { progressPct: 50, stage: "stub" });
      return 50;
    });

    await step.run("progress-100", async () => {
      log.info("process_shoot.progress", { progressPct: 100, stage: "done" });
      funnel.processingCompleted(payload.orgId, payload.shootId, jobId, {
        type: payload.type,
      });
      return 100;
    });

    return { ok: true as const, jobId, progressPct: 100 };
  },
);
