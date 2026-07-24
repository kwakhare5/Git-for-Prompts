-- Add test schedule to prompts.
-- 'daily' = run once per day, 'weekly' = run once per week, NULL = no schedule.
ALTER TABLE "prompts" ADD COLUMN "test_schedule" varchar(10) CHECK ("test_schedule" IN ('daily', 'weekly'));-->statement-breakpoint

-- Track when scheduled tests were last run, so the cron can skip prompts
-- that were already checked within the current window.
ALTER TABLE "prompts" ADD COLUMN "last_scheduled_test_at" timestamp;
