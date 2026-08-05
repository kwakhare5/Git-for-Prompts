-- Migration 0008: Add bundle JSONB column to versions table
--
-- Backward compatible: existing rows default to NULL (V1 text-only versions).
-- New V2 versions populate both `content` (legacy compat) and `bundle` (full payload).
--
-- The bundle column stores a PromptBundle JSON object:
--   { systemPrompt, userTemplate, modelConfig: { provider, model, temperature, ... }, tools?, responseFormat? }

ALTER TABLE "versions" ADD COLUMN "bundle" jsonb;
