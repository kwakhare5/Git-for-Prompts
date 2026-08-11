ALTER TABLE "api_keys" ADD COLUMN "scopes" text[] DEFAULT '{"prompts:read","prompts:write","versions:write"}' NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "revoked_at" timestamp;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "expires_at" timestamp;