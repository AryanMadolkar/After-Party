CREATE TYPE "public"."client_status" AS ENUM('active', 'archived');--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "status" "client_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "external_ref" text;--> statement-breakpoint
UPDATE "clients" SET "slug" = lower(regexp_replace(regexp_replace(coalesce(name, 'client'), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) || '-' || substr(id::text, 1, 8) WHERE "slug" IS NULL;--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "clients_org_slug_idx" ON "clients" USING btree ("org_id","slug");--> statement-breakpoint
CREATE INDEX "clients_status_idx" ON "clients" USING btree ("status");--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "primary_color" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "secondary_colors" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "logo_blob_key" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "voice_notes" text;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "dos" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "donts" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "sample_captions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "caption_languages" jsonb DEFAULT '["en"]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "forbidden_topics" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "must_include_hints" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "brand_kits" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "brand_kits" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "brand_kits" ADD CONSTRAINT "brand_kits_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;