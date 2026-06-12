ALTER TABLE "api_keys" ADD COLUMN "key_lookup_hash" varchar(64) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "api_keys_lookup_hash_idx" ON "api_keys" USING btree ("key_lookup_hash");