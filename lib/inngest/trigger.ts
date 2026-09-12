import { inngest } from "@/lib/inngest/client";
import type { ProcessingJobPayload } from "@/lib/contracts";

/** Fire the hello smoke job (local/preview). */
export async function sendHelloPipeline(payload: ProcessingJobPayload) {
  return inngest.send({
    name: "cutroom/pipeline.hello",
    data: { ...payload, type: "hello" },
  });
}

/** Enqueue the process-shoot stub. */
export async function sendProcessShootPipeline(payload: ProcessingJobPayload) {
  return inngest.send({
    name: "cutroom/pipeline.process-shoot",
    data: payload,
  });
}
