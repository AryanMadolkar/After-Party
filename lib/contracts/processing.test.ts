import { describe, expect, it } from "vitest";

import {
  ALLOWED_MIME,
  AssetScorePayloadSchema,
  DEFAULT_SELECT_TARGETS,
  DEDUP_THRESHOLD,
  EXPORT_JPEG_QUALITY,
  MAX_FILE_BYTES,
  MAX_FILES_PER_SHOOT,
  ProcessingJobPayloadSchema,
  ProcessingJobStatusEnum,
  ProcessingJobTypeEnum,
  ProgressEventSchema,
  REVIEW_LINK_DEFAULT_DAYS,
  VISION_MAX_EDGE_PX,
} from "@/lib/contracts";
import { createMockAi } from "@/lib/ai/cutroom";

describe("§19.6 constants", () => {
  it("matches product limits", () => {
    expect(MAX_FILE_BYTES).toBe(25 * 1024 * 1024);
    expect(MAX_FILES_PER_SHOOT).toBe(500);
    expect(VISION_MAX_EDGE_PX).toBe(1280);
    expect(EXPORT_JPEG_QUALITY).toBe(85);
    expect(DEFAULT_SELECT_TARGETS).toEqual({ feed: 9, stories: 5, linkedin: 3 });
    expect(REVIEW_LINK_DEFAULT_DAYS).toBe(7);
    expect(DEDUP_THRESHOLD).toBe(0.92);
    expect(ALLOWED_MIME).toContain("image/jpeg");
    expect(ALLOWED_MIME).toContain("image/heic");
  });
});

describe("ProcessingJob contracts", () => {
  it("parses payload and progress", () => {
    const payload = ProcessingJobPayloadSchema.parse({
      orgId: "11111111-1111-4111-8111-111111111111",
      shootId: "22222222-2222-4222-8222-222222222222",
      type: "full_pipeline",
    });
    expect(ProcessingJobTypeEnum.options).toContain("hello");
    expect(ProcessingJobStatusEnum.options).toEqual([
      "queued",
      "running",
      "succeeded",
      "failed",
    ]);
    expect(
      ProgressEventSchema.parse({
        orgId: payload.orgId,
        shootId: payload.shootId,
        jobId: "33333333-3333-4333-8333-333333333333",
        progressPct: 50,
        stage: "stub",
      }).progressPct,
    ).toBe(50);
  });
});

describe("AI mocks", () => {
  it("ScoreQuality / ScoreBrand / GenerateCaption are deterministic", async () => {
    const ai = createMockAi();
    const base = {
      orgId: "11111111-1111-4111-8111-111111111111",
      shootId: "22222222-2222-4222-8222-222222222222",
      assetId: "33333333-3333-4333-8333-333333333333",
    };
    const q1 = await ai.scoreQuality.score(base);
    const q2 = await ai.scoreQuality.score(base);
    expect(q1.quality).toBe(q2.quality);
    expect(AssetScorePayloadSchema.parse(q1).model).toBe("mock-score-quality-v1");

    const brand = await ai.scoreBrand.score(base);
    expect(brand.brandFit).toBeGreaterThan(0);

    const caption = await ai.generateCaption.generate({ ...base, locale: "hi" });
    expect(caption.locale).toBe("hi");
    expect(caption.text.length).toBeGreaterThan(0);
  });
});
