export type LogContext = {
  orgId?: string | null;
  shootId?: string | null;
  jobId?: string | null;
  [key: string]: unknown;
};

type LogLevel = "debug" | "info" | "warn" | "error";

function emit(level: LogLevel, message: string, context: LogContext = {}) {
  const { orgId, shootId, jobId, ...rest } = context;
  const line = {
    level,
    message,
    orgId: orgId ?? null,
    shootId: shootId ?? null,
    jobId: jobId ?? null,
    ...rest,
    ts: new Date().toISOString(),
  };
  const serialized = JSON.stringify(line);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.log(serialized);
}

/**
 * Structured logger that always carries orgId / shootId / jobId when known.
 */
export function createLogger(base: LogContext = {}) {
  const merge = (extra?: LogContext): LogContext => ({ ...base, ...extra });
  return {
    debug: (message: string, extra?: LogContext) => emit("debug", message, merge(extra)),
    info: (message: string, extra?: LogContext) => emit("info", message, merge(extra)),
    warn: (message: string, extra?: LogContext) => emit("warn", message, merge(extra)),
    error: (message: string, extra?: LogContext) => emit("error", message, merge(extra)),
    child: (extra: LogContext) => createLogger(merge(extra)),
  };
}

export type Logger = ReturnType<typeof createLogger>;
