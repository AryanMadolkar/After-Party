CREATE TYPE "public"."caption_style" AS ENUM('minimal', 'funny', 'story', 'casual', 'romantic', 'none');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'uploading', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."selection_type" AS ENUM('best_photos', 'carousel', 'photo_dump', 'friends', 'couple', 'aesthetic', 'story');--> statement-breakpoint
CREATE TABLE "captions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"text" text NOT NULL,
	"style" "caption_style" DEFAULT 'minimal' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photo_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_id" uuid NOT NULL,
	"quality_score" real,
	"blur_score" real,
	"composition_score" real,
	"face_count" integer,
	"labels" jsonb,
	"objects" jsonb,
	"duplicate_group" text,
	"embedding_reference" text,
	"analysis" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"blob_url" text NOT NULL,
	"thumbnail_url" text,
	"original_filename" text,
	"mime_type" text,
	"width" integer,
	"height" integer,
	"file_size" integer,
	"exif_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"type" "selection_type" NOT NULL,
	"caption" text,
	"song_name" text,
	"song_artist" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"photo_count" integer DEFAULT 0 NOT NULL,
	"cover_photo_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "selection_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"selection_id" uuid NOT NULL,
	"photo_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"ai_selected" boolean DEFAULT true NOT NULL,
	"user_approved" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "selection_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text,
	"email" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "captions" ADD CONSTRAINT "captions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photo_analysis" ADD CONSTRAINT "photo_analysis_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_photo_id_photos_id_fk" FOREIGN KEY ("cover_photo_id") REFERENCES "public"."photos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selection_photos" ADD CONSTRAINT "selection_photos_selection_id_selections_id_fk" FOREIGN KEY ("selection_id") REFERENCES "public"."selections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selection_photos" ADD CONSTRAINT "selection_photos_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selections" ADD CONSTRAINT "selections_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selections" ADD CONSTRAINT "selections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "captions_project_id_idx" ON "captions" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "captions_created_at_idx" ON "captions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "photo_analysis_photo_id_idx" ON "photo_analysis" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "photo_analysis_duplicate_group_idx" ON "photo_analysis" USING btree ("duplicate_group");--> statement-breakpoint
CREATE INDEX "photo_analysis_created_at_idx" ON "photo_analysis" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "photos_project_id_idx" ON "photos" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "photos_user_id_idx" ON "photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_project_id_idx" ON "posts" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "projects_user_id_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "selection_photos_selection_id_idx" ON "selection_photos" USING btree ("selection_id");--> statement-breakpoint
CREATE INDEX "selection_photos_photo_id_idx" ON "selection_photos" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "selections_project_id_idx" ON "selections" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "selections_user_id_idx" ON "selections" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "selections_created_at_idx" ON "selections" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_user_id_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");