import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/git_for_prompts_test',
  },
  verbose: true,
  strict: false,
});
