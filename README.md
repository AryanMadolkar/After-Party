# After Party

Turn hundreds of photos into the perfect post.

After Party is an AI-powered photo curation platform. Upload the 100–300 photos from a
trip or event and it analyzes them, detects duplicates, understands context, selects
the strongest shots, and builds Instagram-ready carousels, photo dumps, captions, and
song recommendations.

This repository is the **production-ready foundation**: auth, database, storage,
upload pipeline, and full UI, with the AI layer implemented behind clean interfaces
returning mocked data. The real analysis/selection/caption/music engines can be
swapped in later without touching any calling code — see [Remaining TODOs](#remaining-todos-for-the-real-ai-pipeline).

## Tech stack

- **Frontend** — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide icons, Framer Motion
- **Database** — Neon Postgres + Drizzle ORM
- **Auth** — Clerk
- **Storage** — Vercel Blob
- **Validation** — Zod

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local` — see [Environment variables](#environment-variables) below.

### 3. Set up the database

```bash
npm run db:generate   # generate SQL migrations from db/schema.ts (already generated in drizzle/)
npm run db:migrate    # apply migrations to your Neon database
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Where to get it |
| --- | --- |
| `DATABASE_URL` | Neon project dashboard → Connection Details |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `BLOB_READ_WRITE_TOKEN` | Vercel project → Storage → Blob |
| `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` | Prepared for the real AI pipeline — not required yet |

Server-only secrets (`DATABASE_URL`, `CLERK_SECRET_KEY`, `BLOB_READ_WRITE_TOKEN`) are
validated in `lib/env.ts` and are never imported into client components.

### Neon setup

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL`.
3. Run `npm run db:migrate`.

### Clerk setup

1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com).
2. Copy the publishable and secret keys into `.env.local`.
3. This app uses Clerk's default routing — no webhook is required. A user's row in
   `users` is created lazily on their first authenticated request (see
   `lib/auth/current-user.ts`).

### Vercel Blob setup

1. In your Vercel project, open the **Storage** tab and create a Blob store.
2. Copy the read/write token into `BLOB_READ_WRITE_TOKEN`.
3. Uploads go directly from the browser to Blob via `app/api/upload/route.ts`
   (a scoped, short-lived token per upload) — files never pass through the server.

## Database commands

```bash
npm run db:generate   # diff db/schema.ts against drizzle/ and generate new SQL migrations
npm run db:migrate     # apply pending migrations
npm run db:studio      # open Drizzle Studio against DATABASE_URL
```

## Production deployment (Vercel)

1. Push this repository to GitHub and import it in Vercel.
2. Add the environment variables above in the Vercel project settings.
3. Provision a Neon database and a Vercel Blob store if you haven't already.
4. Run `npm run db:migrate` against the production `DATABASE_URL` (locally, or via a
   one-off deployment step) before the first deploy.
5. Deploy. `next build` runs automatically.

## Remaining TODOs for the real AI pipeline

Everything AI-related lives behind interfaces in `lib/ai/*` and currently returns
deterministic mocked data — nothing else in the app depends on a specific provider.

- [ ] `lib/ai/analyzer.ts` — replace with real vision-model scoring (quality, blur, composition, faces, labels, objects)
- [ ] `lib/ai/embeddings.ts` — real embeddings + a vector index (or a pgvector column) instead of `embedding_reference` pointers
- [ ] `lib/photos/duplicates.ts` — already does real perceptual hashing client-side; wire its output into `photo_analysis.duplicate_group` during processing
- [ ] `lib/ai/ranking.ts` — factor in embedding-based diversity and duplicate-group suppression, not just per-photo scores
- [ ] `lib/ai/carousel.ts` — smarter selection (pacing, subject variety) beyond "top N by score"
- [ ] `lib/ai/captions.ts` — LLM-generated captions using real trip/event context
- [ ] `lib/ai/music.ts` — real music API + mood inference from photo analysis
- [ ] `lib/ai/editor.ts` — generative/AI-driven photo editing
- [ ] `lib/projects/processing.ts` — move analysis off the request path into a background job/queue (currently runs inline since it's mocked and fast)
- [ ] Server-side thumbnail generation for formats the browser canvas can't decode
