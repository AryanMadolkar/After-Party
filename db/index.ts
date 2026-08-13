import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import { serverEnv } from "@/lib/env";
import * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

// Constructed lazily (on first query), not at module import time — see the
// comment in lib/env.ts for why that matters for the build.
let instance: Database | null = null;
function getInstance(): Database {
  if (!instance) {
    const sql = neon(serverEnv.DATABASE_URL);
    instance = drizzle(sql, { schema });
  }
  return instance;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getInstance(), prop, receiver);
  },
});
