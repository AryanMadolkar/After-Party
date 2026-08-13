import { z } from "zod";

/**
 * Server-only environment variables. Importing this file from a client
 * component will fail at build time, which is the point — it keeps secrets
 * out of the browser bundle.
 *
 * OAuth credentials are optional at the schema level even though the
 * Google/Apple sign-in buttons need them: making them required here would
 * mean any route that merely imports `serverEnv` (e.g. anything touching
 * the database) fails the moment OAuth isn't configured yet, even for
 * requests that never use it. The Google/Apple route handlers check for
 * their own credentials explicitly and fail there instead — see
 * lib/auth/oauth/google.ts and lib/auth/oauth/apple.ts.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, "BLOB_READ_WRITE_TOKEN is required"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  // The .p8 private key's PEM contents. Stored in env vars as a single
  // line with literal "\n" sequences (the only format most env var UIs
  // accept for multi-line secrets) — un-escaped back to real newlines in
  // lib/auth/oauth/apple.ts before use.
  APPLE_PRIVATE_KEY: z.string().optional(),

  // Prepared for the real AI pipeline. Not required for the mocked foundation.
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
});

function validate<T extends z.ZodTypeAny>(
  schema: T,
  source: Record<string, unknown>,
  label: string,
): z.infer<T> {
  const parsed = schema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid ${label} environment variables:\n${issues}`);
  }
  return parsed.data;
}

/**
 * Lazily validates and caches on first property access, rather than at
 * module import time. This matters: Next.js's build step imports every
 * route module (to inspect config like `runtime`) without invoking it, so
 * eager top-level validation would fail the entire build the moment a
 * secret is missing — even for routes that don't touch it, and even for
 * preview deployments that legitimately don't have every secret configured.
 * Deferring validation to first *use* keeps `next build` decoupled from
 * "is every production secret filled in yet".
 */
function lazy<T extends object>(load: () => T): T {
  let cached: T | null = null;
  return new Proxy({} as T, {
    get(_target, prop, receiver) {
      if (!cached) cached = load();
      return Reflect.get(cached, prop, receiver);
    },
  });
}

export const serverEnv = lazy(() => validate(serverEnvSchema, process.env, "server"));
