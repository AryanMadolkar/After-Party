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
- **Auth** — Custom (email/password + Google OAuth) — see [Authentication](#authentication)
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
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console — optional, see below |
| `BLOB_READ_WRITE_TOKEN` | Vercel project → Storage → Blob |
| `OPENAI_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` | Prepared for the real AI pipeline — not required yet |

Server-only secrets are validated in `lib/env.ts` and are never imported into client
components. Email/password sign-in needs no environment variables at all — it's
entirely self-contained (see [Authentication](#authentication)).

### Neon setup

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL`.
3. Run `npm run db:migrate`.

## Authentication

There's no third-party auth provider — sign-up, sign-in, sessions, and OAuth are all
implemented in `lib/auth/`. See the code comments there for the security reasoning
(password hashing, session token handling, OAuth account linking); the short version:

- **Passwords** are hashed with Node's built-in `scrypt` (`lib/auth/password.ts`) — no
  extra dependency.
- **Sessions** are server-side rows in the `sessions` table. The browser only ever
  holds a random opaque token in an `httpOnly` cookie; the database stores just its
  SHA-256 hash, so a database leak alone can't produce a usable session
  (`lib/auth/session.ts`).
- **Google ID tokens** are verified against Google's live JWKS using
  [`jose`](https://github.com/panva/jose) — the one non-Node-builtin dependency this
  system uses, and only for that narrow "verify a provider-signed JWT" task.
- **Not built yet** (foundation-phase scope, same spirit as the mocked AI layer):
  email verification, password reset, and login rate-limiting. All straightforward
  additions on top of the current `users`/`sessions` tables — see
  [Remaining TODOs](#remaining-todos).

### Google OAuth setup (optional)

1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services →
   Credentials → **Create OAuth client ID** → Web application.
2. Add authorized redirect URIs for both environments:
   `http://localhost:3000/api/auth/google/callback` and
   `https://yourdomain.com/api/auth/google/callback`.
3. Copy the client ID and secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

Until these are set, the "continue with google" button redirects back to sign-in with
a clear error instead of crashing anything else.

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

## Remaining TODOs

### AI pipeline

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

### Auth

- [ ] Email verification (the `email_verified_at` column exists but nothing sets it for password sign-ups)
- [ ] Password reset flow — needs a transactional email provider
- [ ] Rate limiting on `signInAction` / `signUpAction` to slow down credential stuffing
- [ ] A periodic job to delete expired rows from `sessions` (expired sessions are already rejected on lookup — this is just housekeeping)
