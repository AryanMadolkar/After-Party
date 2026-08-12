import { z } from "zod";

/**
 * Server-only environment variables. Importing this file from a client
 * component will fail at build time, which is the point — it keeps secrets
 * out of the browser bundle.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, "BLOB_READ_WRITE_TOKEN is required"),
  // Prepared for the real AI pipeline. Not required for the mocked foundation.
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
});

/**
 * Public environment variables. These are inlined into the client bundle by
 * Next.js at build time, so only ever put non-secret, NEXT_PUBLIC_-prefixed
 * values here.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
});

function loadServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid server environment variables:\n${issues}`);
  }
  return parsed.data;
}

function loadPublicEnv() {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid public environment variables:\n${issues}`);
  }
  return parsed.data;
}

export const serverEnv = loadServerEnv();
export const publicEnv = loadPublicEnv();
