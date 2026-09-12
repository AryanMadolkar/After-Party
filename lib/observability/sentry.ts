import "server-only";

import * as Sentry from "@sentry/nextjs";

let initialized = false;

/**
 * Lightweight Sentry skeleton. No-ops when SENTRY_DSN is unset so local
 * and preview deploys without secrets still boot.
 */
export function initSentry() {
  if (initialized) return;
  initialized = true;

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.05),
    enabled: true,
  });
}

export function captureException(
  error: unknown,
  context: { orgId?: string; shootId?: string; jobId?: string; extra?: Record<string, unknown> } = {},
) {
  initSentry();
  if (!process.env.SENTRY_DSN) return;

  Sentry.withScope((scope) => {
    if (context.orgId) scope.setTag("orgId", context.orgId);
    if (context.shootId) scope.setTag("shootId", context.shootId);
    if (context.jobId) scope.setTag("jobId", context.jobId);
    if (context.extra) scope.setExtras(context.extra);
    Sentry.captureException(error);
  });
}
