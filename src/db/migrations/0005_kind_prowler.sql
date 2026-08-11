CREATE TABLE "webhooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" varchar(255) NOT NULL,
	"prompt_id" uuid,
	"url" varchar(2048) NOT NULL,
	"secret_hash" varchar(64) NOT NULL,
	"label" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "key_hash" SET DEFAULT 'sha256_only';--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "test_schedule" varchar(10);--> statement-breakpoint
ALTER TABLE "prompts" ADD COLUMN "last_scheduled_test_at" timestamp;--> statement-breakpoint
ALTER TABLE "versions" ADD COLUMN "bundle" jsonb;--> statement-breakpoint
ALTER TABLE "versions" ADD COLUMN "variables" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_prompt_id_prompts_id_fk" FOREIGN KEY ("prompt_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "webhooks_owner_id_idx" ON "webhooks" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "webhooks_prompt_id_idx" ON "webhooks" USING btree ("prompt_id");--> statement-breakpoint
CREATE INDEX "prompts_is_public_idx" ON "prompts" USING btree ("is_public");--> statement-breakpoint
CREATE UNIQUE INDEX "prompts_owner_name_unique" ON "prompts" USING btree ("owner_id","name");--> statement-breakpoint
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_current_version_id_fk" FOREIGN KEY ("current_version_id") REFERENCES "public"."versions"("id") ON DELETE set null ON UPDATE no action;