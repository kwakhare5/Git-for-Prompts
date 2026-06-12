CREATE INDEX "prompts_owner_id_idx" ON "prompts" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "test_cases_prompt_id_idx" ON "test_cases" USING btree ("prompt_id");--> statement-breakpoint
CREATE INDEX "test_results_version_id_idx" ON "test_results" USING btree ("version_id");--> statement-breakpoint
CREATE INDEX "versions_prompt_id_idx" ON "versions" USING btree ("prompt_id");