import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prevent multiple connections in development (Next.js hot reload)
const globalForDb = globalThis as unknown as { _pgClient: ReturnType<typeof postgres> };

const client =
  globalForDb._pgClient ??
  postgres(process.env.DATABASE_URL!, {
    max: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS, 10) : 20,
    idle_timeout: 20,
    connect_timeout: 30,
  });

if (process.env.NODE_ENV !== 'production') globalForDb._pgClient = client;

export const db = drizzle(client, { schema });
