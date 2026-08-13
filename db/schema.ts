import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "uploading",
  "processing",
  "ready",
  "failed",
]);

export const selectionTypeEnum = pgEnum("selection_type", [
  "best_photos",
  "carousel",
  "photo_dump",
  "friends",
  "couple",
  "aesthetic",
  "story",
]);

export const captionStyleEnum = pgEnum("caption_style", [
  "minimal",
  "funny",
  "story",
  "casual",
  "romantic",
  "none",
]);

export const oauthProviderEnum = pgEnum("oauth_provider", ["google", "apple"]);

// ---------------------------------------------------------------------------
// users
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    // Null for accounts created via OAuth that never set a password.
    passwordHash: text("password_hash"),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_created_at_idx").on(table.createdAt),
  ],
);

/**
 * Links a user to an external identity (Google/Apple `sub`). A user can
 * have both a password AND one or more linked OAuth accounts. Accounts are
 * only auto-linked to an existing user when the provider's ID token claims
 * email_verified === true for a matching email — see
 * lib/auth/oauth/link-account.ts.
 */
export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: oauthProviderEnum("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("oauth_accounts_provider_account_idx").on(table.provider, table.providerAccountId),
    index("oauth_accounts_user_id_idx").on(table.userId),
  ],
);

/**
 * Server-side sessions. The cookie sent to the browser holds the raw
 * random token; only its SHA-256 hash is stored here, so a database leak
 * doesn't hand out valid sessions directly. See lib/auth/session.ts.
 */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_idx").on(table.tokenHash),
    index("sessions_user_id_idx").on(table.userId),
  ],
);

// ---------------------------------------------------------------------------
// projects
// ---------------------------------------------------------------------------

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: projectStatusEnum("status").notNull().default("draft"),
    photoCount: integer("photo_count").notNull().default(0),
    coverPhotoId: uuid("cover_photo_id").references((): AnyPgColumn => photos.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("projects_user_id_idx").on(table.userId),
    index("projects_created_at_idx").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// photos
// ---------------------------------------------------------------------------

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    blobUrl: text("blob_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    originalFilename: text("original_filename"),
    mimeType: text("mime_type"),
    width: integer("width"),
    height: integer("height"),
    fileSize: integer("file_size"),
    exifData: jsonb("exif_data").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("photos_project_id_idx").on(table.projectId),
    index("photos_user_id_idx").on(table.userId),
    index("photos_created_at_idx").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// photo_analysis
// ---------------------------------------------------------------------------

export const photoAnalysis = pgTable(
  "photo_analysis",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    photoId: uuid("photo_id")
      .notNull()
      .references(() => photos.id, { onDelete: "cascade" }),
    qualityScore: real("quality_score"),
    blurScore: real("blur_score"),
    compositionScore: real("composition_score"),
    faceCount: integer("face_count"),
    labels: jsonb("labels").$type<string[]>(),
    objects: jsonb("objects").$type<string[]>(),
    duplicateGroup: text("duplicate_group"),
    embeddingReference: text("embedding_reference"),
    analysis: jsonb("analysis").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("photo_analysis_photo_id_idx").on(table.photoId),
    index("photo_analysis_duplicate_group_idx").on(table.duplicateGroup),
    index("photo_analysis_created_at_idx").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// selections
// ---------------------------------------------------------------------------

export const selections = pgTable(
  "selections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: selectionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("selections_project_id_idx").on(table.projectId),
    index("selections_user_id_idx").on(table.userId),
    index("selections_created_at_idx").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// selection_photos
// ---------------------------------------------------------------------------

export const selectionPhotos = pgTable(
  "selection_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    selectionId: uuid("selection_id")
      .notNull()
      .references(() => selections.id, { onDelete: "cascade" }),
    photoId: uuid("photo_id")
      .notNull()
      .references(() => photos.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    aiSelected: boolean("ai_selected").notNull().default(true),
    userApproved: boolean("user_approved").notNull().default(false),
  },
  (table) => [
    index("selection_photos_selection_id_idx").on(table.selectionId),
    index("selection_photos_photo_id_idx").on(table.photoId),
  ],
);

// ---------------------------------------------------------------------------
// captions
// ---------------------------------------------------------------------------

export const captions = pgTable(
  "captions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    style: captionStyleEnum("style").notNull().default("minimal"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("captions_project_id_idx").on(table.projectId),
    index("captions_created_at_idx").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// posts
// ---------------------------------------------------------------------------

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    // Reuses selectionTypeEnum: a post's type is "which kind of selection
    // this was published from" (best_photos, carousel, photo_dump, ...).
    type: selectionTypeEnum("type").notNull(),
    caption: text("caption"),
    songName: text("song_name"),
    songArtist: text("song_artist"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("posts_project_id_idx").on(table.projectId),
    index("posts_created_at_idx").on(table.createdAt),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  oauthAccounts: many(oauthAccounts),
  sessions: many(sessions),
}));

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, { fields: [oauthAccounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  coverPhoto: one(photos, { fields: [projects.coverPhotoId], references: [photos.id] }),
  photos: many(photos),
  selections: many(selections),
  captions: many(captions),
  posts: many(posts),
}));

export const photosRelations = relations(photos, ({ one, many }) => ({
  project: one(projects, { fields: [photos.projectId], references: [projects.id] }),
  user: one(users, { fields: [photos.userId], references: [users.id] }),
  analysis: one(photoAnalysis, {
    fields: [photos.id],
    references: [photoAnalysis.photoId],
  }),
  selectionPhotos: many(selectionPhotos),
}));

export const photoAnalysisRelations = relations(photoAnalysis, ({ one }) => ({
  photo: one(photos, { fields: [photoAnalysis.photoId], references: [photos.id] }),
}));

export const selectionsRelations = relations(selections, ({ one, many }) => ({
  project: one(projects, { fields: [selections.projectId], references: [projects.id] }),
  user: one(users, { fields: [selections.userId], references: [users.id] }),
  selectionPhotos: many(selectionPhotos),
}));

export const selectionPhotosRelations = relations(selectionPhotos, ({ one }) => ({
  selection: one(selections, {
    fields: [selectionPhotos.selectionId],
    references: [selections.id],
  }),
  photo: one(photos, { fields: [selectionPhotos.photoId], references: [photos.id] }),
}));

export const captionsRelations = relations(captions, ({ one }) => ({
  project: one(projects, { fields: [captions.projectId], references: [projects.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  project: one(projects, { fields: [posts.projectId], references: [projects.id] }),
}));

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type OAuthAccount = typeof oauthAccounts.$inferSelect;
export type NewOAuthAccount = typeof oauthAccounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;

export type PhotoAnalysis = typeof photoAnalysis.$inferSelect;
export type NewPhotoAnalysis = typeof photoAnalysis.$inferInsert;

export type Selection = typeof selections.$inferSelect;
export type NewSelection = typeof selections.$inferInsert;

export type SelectionPhoto = typeof selectionPhotos.$inferSelect;
export type NewSelectionPhoto = typeof selectionPhotos.$inferInsert;

export type Caption = typeof captions.$inferSelect;
export type NewCaption = typeof captions.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export type SelectionType = (typeof selectionTypeEnum.enumValues)[number];
export type CaptionStyle = (typeof captionStyleEnum.enumValues)[number];
export type OAuthProvider = (typeof oauthProviderEnum.enumValues)[number];
/** A post's type mirrors selection type — see the `posts.type` column comment. */
export type PostType = SelectionType;
