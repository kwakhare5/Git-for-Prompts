-- Add variables column to versions table.
-- Stores the list of {{variable}} placeholders found in the prompt content.
-- Auto-extracted on save so the API can advertise available variables to callers.
ALTER TABLE "versions" ADD COLUMN "variables" text[] DEFAULT '{}' NOT NULL;
