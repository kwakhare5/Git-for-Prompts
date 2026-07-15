-- Auto-update updated_at on prompts via trigger.
-- Defense-in-depth: app code already sets updated_at manually on saves,
-- but any future code path that forgets will still produce correct timestamps.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;-->statement-breakpoint
CREATE OR REPLACE TRIGGER prompts_set_updated_at
  BEFORE UPDATE ON "prompts"
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();-->statement-breakpoint

-- Drop the two individual indexes on test_results and replace with a composite
-- UNIQUE index on (version_id, test_case_id).
-- UNIQUE enables upsert (ON CONFLICT DO UPDATE) so re-running tests doesn't
-- accumulate duplicate rows — it updates the latest result in-place.
DROP INDEX IF EXISTS "test_results_version_id_idx";-->statement-breakpoint
DROP INDEX IF EXISTS "test_results_test_case_id_idx";-->statement-breakpoint
CREATE UNIQUE INDEX "test_results_version_test_case_unique" ON "test_results" USING btree ("version_id", "test_case_id");
