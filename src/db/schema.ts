import { pgTable, uuid, varchar, text, boolean, integer, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { PromptBundle } from '@gfp/core';

// ─────────────────────────────────────────────────────────────────────────────
// prompts — top-level entity, metadata only. Content lives in versions.
// ─────────────────────────────────────────────────────────────────────────────
export const prompts = pgTable(
  'prompts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    ownerId: varchar('owner_id', { length: 255 }).notNull(), // Clerk userId
    isPublic: boolean('is_public').default(false).notNull(),
    currentVersionId: uuid('current_version_id'), // FK to versions (set after first version)
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    // Scheduled regression tests
    testSchedule: varchar('test_schedule', { length: 10 }).$type<'daily' | 'weekly'>(), // null = no schedule
    lastScheduledTestAt: timestamp('last_scheduled_test_at'),
  },
  (t) => [
    index('prompts_owner_id_idx').on(t.ownerId),
    index('prompts_is_public_idx').on(t.isPublic), // for the /explore public gallery query
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// versions — immutable. Every save = new row. Never edit an existing version.
// ─────────────────────────────────────────────────────────────────────────────
export const versions = pgTable(
  'versions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    promptId: uuid('prompt_id')
      .notNull()
      .references(() => prompts.id, { onDelete: 'cascade' }),
    versionNumber: integer('version_number').notNull(), // 1, 2, 3… per prompt
    content: text('content').notNull(),                 // The actual prompt text (always set; V2: mirrors bundle.userTemplate)
    bundle: jsonb('bundle').$type<PromptBundle>(),       // V2 full bundle payload (null for V1 versions)
    commitMessage: varchar('commit_message', { length: 500 }), // "Made tone friendlier"
    createdBy: varchar('created_by', { length: 255 }).notNull(), // Clerk userId
    createdAt: timestamp('created_at').defaultNow().notNull(),
    variables: text('variables').array().default([]).notNull(), // {{var}} placeholders extracted from content/bundle
  },
  (t) => [
    index('versions_prompt_id_idx').on(t.promptId),
    uniqueIndex('versions_prompt_version_unique').on(t.promptId, t.versionNumber),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// test_cases — what a prompt must do. Used to score versions.
// ─────────────────────────────────────────────────────────────────────────────
export const testCases = pgTable(
  'test_cases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    promptId: uuid('prompt_id')
      .notNull()
      .references(() => prompts.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),          // "Mentions refund window"
    inputText: text('input_text').notNull(),                   // User message sent to the AI
    expectedCriteria: text('expected_criteria').notNull(),     // "must mention 30 days"
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('test_cases_prompt_id_idx').on(t.promptId)]
);

// ─────────────────────────────────────────────────────────────────────────────
// test_results — one row per (version × test_case) run.
// ─────────────────────────────────────────────────────────────────────────────
export const testResults = pgTable(
  'test_results',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    versionId: uuid('version_id')
      .notNull()
      .references(() => versions.id, { onDelete: 'cascade' }),
    testCaseId: uuid('test_case_id')
      .notNull()
      .references(() => testCases.id, { onDelete: 'cascade' }),
    passed: boolean('passed').notNull(),
    actualOutput: text('actual_output').notNull(), // What the AI actually returned
    score: integer('score'),                       // 0-100 optional confidence score
    runAt: timestamp('run_at').defaultNow().notNull(),
  },
  (t) => [
    // Composite unique index on (versionId, testCaseId):
    // - covers the dedup query in getPromptsWithStats directly
    // - the UNIQUE constraint enables upsert (ON CONFLICT DO UPDATE)
    //   so re-running tests updates the latest result instead of appending duplicates.
    uniqueIndex('test_results_version_test_case_unique').on(t.versionId, t.testCaseId),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// api_keys — for the public API. Never store plaintext keys.
// ─────────────────────────────────────────────────────────────────────────────
export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: varchar('owner_id', { length: 255 }).notNull(), // Clerk userId
    name: varchar('name', { length: 255 }).notNull(),         // "Production key"
    keyHash: varchar('key_hash', { length: 255 }).default('sha256_only').notNull(),  // SHA-256 legacy placeholder — bcrypt eliminated
    keyLookupHash: varchar('key_lookup_hash', { length: 64 }).notNull(), // SHA-256 for O(1) lookup
    keyPrefix: varchar('key_prefix', { length: 10 }).notNull(), // "gfp_live_" prefix for display
    lastUsedAt: timestamp('last_used_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('api_keys_owner_id_idx').on(t.ownerId),
    uniqueIndex('api_keys_lookup_hash_idx').on(t.keyLookupHash),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Relations — Drizzle relational query support
// ─────────────────────────────────────────────────────────────────────────────
export const promptsRelations = relations(prompts, ({ many }) => ({
  versions: many(versions),
  testCases: many(testCases),
}));

export const versionsRelations = relations(versions, ({ one, many }) => ({
  prompt: one(prompts, { fields: [versions.promptId], references: [prompts.id] }),
  testResults: many(testResults),
}));

export const testCasesRelations = relations(testCases, ({ one, many }) => ({
  prompt: one(prompts, { fields: [testCases.promptId], references: [prompts.id] }),
  testResults: many(testResults),
}));

export const testResultsRelations = relations(testResults, ({ one }) => ({
  version: one(versions, { fields: [testResults.versionId], references: [versions.id] }),
  testCase: one(testCases, { fields: [testResults.testCaseId], references: [testCases.id] }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// webhooks — user-registered URLs that get POSTed on every new version save.
// promptId NULL = fires for ALL version saves by this user (global hook).
// ─────────────────────────────────────────────────────────────────────────────
export const webhooks = pgTable(
  'webhooks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: varchar('owner_id', { length: 255 }).notNull(),
    promptId: uuid('prompt_id').references(() => prompts.id, { onDelete: 'cascade' }), // nullable = global
    url: varchar('url', { length: 2048 }).notNull(),
    secretHash: varchar('secret_hash', { length: 64 }).notNull(), // SHA-256(secret) for HMAC-SHA256 signing
    label: varchar('label', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('webhooks_owner_id_idx').on(t.ownerId),
    index('webhooks_prompt_id_idx').on(t.promptId),
  ]
);

export const webhooksRelations = relations(webhooks, ({ one }) => ({
  prompt: one(prompts, { fields: [webhooks.promptId], references: [prompts.id] }),
}));

