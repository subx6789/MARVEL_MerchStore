// ─────────────────────────────────────────────────────────
// Database Connection — Drizzle ORM + postgres.js
// ─────────────────────────────────────────────────────────
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use a single connection in development
// In production, use a connection pool
const connectionString = process.env.DATABASE_URL!;

// Disable prefetch for Supabase Transaction Pooler (if using port 6543)
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema, logger: process.env.NODE_ENV === "development" });

// Re-export schema for convenience
export * from "./schema";
