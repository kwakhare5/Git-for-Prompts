CREATE INDEX "api_keys_owner_id_idx" ON "api_keys" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "test_results_test_case_id_idx" ON "test_results" USING btree ("test_case_id");--> statement-breakpoint
CREATE UNIQUE INDEX "versions_prompt_version_unique" ON "versions" USING btree ("prompt_id","version_number");