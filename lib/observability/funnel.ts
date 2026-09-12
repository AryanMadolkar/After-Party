import "server-only";

import { createLogger } from "@/lib/observability/logger";

export type FunnelEventName =
  | "shoot_created"
  | "upload_completed"
  | "processing_completed"
  | "export_completed";

export type FunnelEvent = {
  name: FunnelEventName;
  orgId: string;
  shootId: string;
  jobId?: string;
  properties?: Record<string, unknown>;
};

/**
 * Product funnel stubs — replace with PostHog/Segment later.
 * Always logs with orgId/shootId/jobId for observability continuity.
 */
export function trackFunnel(event: FunnelEvent) {
  const log = createLogger({
    orgId: event.orgId,
    shootId: event.shootId,
    jobId: event.jobId ?? null,
  });
  log.info(`funnel.${event.name}`, {
    funnel: event.name,
    ...event.properties,
  });
}

export const funnel = {
  shootCreated: (orgId: string, shootId: string, properties?: Record<string, unknown>) =>
    trackFunnel({ name: "shoot_created", orgId, shootId, properties }),
  uploadCompleted: (orgId: string, shootId: string, properties?: Record<string, unknown>) =>
    trackFunnel({ name: "upload_completed", orgId, shootId, properties }),
  processingCompleted: (
    orgId: string,
    shootId: string,
    jobId?: string,
    properties?: Record<string, unknown>,
  ) => trackFunnel({ name: "processing_completed", orgId, shootId, jobId, properties }),
  exportCompleted: (
    orgId: string,
    shootId: string,
    jobId?: string,
    properties?: Record<string, unknown>,
  ) => trackFunnel({ name: "export_completed", orgId, shootId, jobId, properties }),
};
