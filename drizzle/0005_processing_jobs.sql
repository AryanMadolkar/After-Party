CREATE TYPE "public"."processing_job_status" AS ENUM('queued', 'running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."processing_job_type" AS ENUM('full_pipeline', 'generate_captions', 'build_export', 'score_assets', 'hello');--> statement-breakpoint
CREATE TABLE "processing_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"shoot_id" uuid NOT NULL,
	"type" "processing_job_type" NOT NULL,
	"status" "processing_job_status" DEFAULT 'queued' NOT NULL,
	"progress_pct" integer DEFAULT 0 NOT NULL,
	"triggered_by" uuid,
	"error" text,
	"payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "shoots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"client_id" uuid,
	"name" text DEFAULT 'Untitled shoot' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "processing_jobs" ADD CONSTRAINT "processing_jobs_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processing_jobs" ADD CONSTRAINT "processing_jobs_shoot_id_shoots_id_fk" FOREIGN KEY ("shoot_id") REFERENCES "public"."shoots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processing_jobs" ADD CONSTRAINT "processing_jobs_triggered_by_users_id_fk" FOREIGN KEY ("triggered_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoots" ADD CONSTRAINT "shoots_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shoots" ADD CONSTRAINT "shoots_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "processing_jobs_org_id_idx" ON "processing_jobs" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "processing_jobs_shoot_id_idx" ON "processing_jobs" USING btree ("shoot_id");--> statement-breakpoint
CREATE INDEX "processing_jobs_status_idx" ON "processing_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "processing_jobs_created_at_idx" ON "processing_jobs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "shoots_org_id_idx" ON "shoots" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "shoots_client_id_idx" ON "shoots" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "shoots_created_at_idx" ON "shoots" USING btree ("created_at");