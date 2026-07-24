-- Webhooks table.
-- Users register a URL (per-prompt or global) that gets POSTed when a new version is saved.
-- promptId NULL = fires on ALL version saves for this user.
CREATE TABLE "webhooks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "owner_id" varchar(255) NOT NULL,
  "prompt_id" uuid,
  "url" varchar(2048) NOT NULL,
  "secret_hash" varchar(64) NOT NULL,   -- SHA-256(secret) for HMAC signing
  "label" varchar(255),
  "created_at" timestamp DEFAULT now() NOT NULL,
  FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE
);-->statement-breakpoint
CREATE INDEX "webhooks_owner_id_idx" ON "webhooks" ("owner_id");-->statement-breakpoint
CREATE INDEX "webhooks_prompt_id_idx" ON "webhooks" ("prompt_id");
