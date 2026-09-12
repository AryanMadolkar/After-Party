# BE2 open questions — defaults (Solo-P3)

Status: **Accepted for Solo-P3 skeleton.** Revisit before live scoring (P5/P6).

## OQ-01 — Vision model for quality / brand scoring

**Decision:** Primary **Gemini** (Flash / Pro vision via `GOOGLE_GENERATIVE_AI_API_KEY`). Fallback / A-B path **GPT-4o-mini** vision (`OPENAI_API_KEY`).

**Rationale:** Gemini is cost-effective for batch shoot folders; GPT-4o-mini keeps a second vendor for latency/quality escapes. Solo-P3 ships interfaces + mocks + adapter stubs only — no live HTTP yet (`lib/ai/adapters/*`).

## OQ-02 — Caption / language model

**Decision:** **Same LLM family as OQ-01** (Gemini primary, GPT-4o-mini secondary) for EN/HI client-voice captions.

**Rationale:** One prompt/ops surface for ScoreBrand notes and GenerateCaption; avoids splitting vendor quotas early. Real caption work is Solo-P7.

## OQ-03 — Job queue

**Decision:** **Inngest** (`cutroom` app id; events `cutroom/pipeline.hello`, `cutroom/pipeline.process-shoot`).

**Rationale:** Native Next.js serve route, step functions for progressPct, easy local/dev via Inngest Dev Server. Aligns with async packaging (upload → score → caption → export) without operating Redis workers in P3.

## Related knobs

| Constant | Value | Notes |
|---|---|---|
| `DEDUP_THRESHOLD` | `0.92` | Placeholder cosine similarity; tune in P5/P6 |
| `VISION_MAX_EDGE_PX` | `1280` | §19.6 |
| `MAX_FILE_BYTES` | 25MB | §19.6 |
| `MAX_FILES_PER_SHOOT` | 500 | §19.6 |

## Env (optional until live)

```
SENTRY_DSN=
SENTRY_ENVIRONMENT=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
CUTROOM_AI_PROVIDER=mock|gemini|openai
```
