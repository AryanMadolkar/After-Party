import { inngest } from "@/lib/inngest/client";
import { helloPipeline, processShootPipeline } from "@/lib/inngest/functions/pipelines";

export const inngestFunctions = [helloPipeline, processShootPipeline];

export { inngest, helloPipeline, processShootPipeline };
export { sendHelloPipeline, sendProcessShootPipeline } from "@/lib/inngest/trigger";
