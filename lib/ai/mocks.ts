import {
  AssetScorePayloadSchema,
  BrandScorePayloadSchema,
  CaptionPayloadSchema,
  type AssetScorePayload,
  type BrandScorePayload,
  type CaptionPayload,
} from "@/lib/contracts";
import type {
  CutRoomAi,
  GenerateCaption,
  GenerateCaptionInput,
  ScoreBrand,
  ScoreBrandInput,
  ScoreQuality,
  ScoreQualityInput,
} from "@/lib/ai/interfaces";

/** Deterministic hash → 0..1 for stable mocks. */
function unitFromId(id: string, salt = 0): number {
  let h = salt * 2654435761;
  for (let i = 0; i < id.length; i += 1) {
    h = (h ^ id.charCodeAt(i)) * 16777619;
  }
  return ((h >>> 0) % 10_000) / 10_000;
}

export class MockScoreQuality implements ScoreQuality {
  async score(input: ScoreQualityInput): Promise<AssetScorePayload> {
    const quality = 0.55 + unitFromId(input.assetId, 1) * 0.4;
    return AssetScorePayloadSchema.parse({
      assetId: input.assetId,
      orgId: input.orgId,
      shootId: input.shootId,
      quality: Number(quality.toFixed(3)),
      sharpness: Number((0.5 + unitFromId(input.assetId, 2) * 0.45).toFixed(3)),
      exposure: Number((0.45 + unitFromId(input.assetId, 3) * 0.5).toFixed(3)),
      faces: Math.floor(unitFromId(input.assetId, 4) * 4),
      labels: ["mock", "ugc"],
      model: "mock-score-quality-v1",
    });
  }
}

export class MockScoreBrand implements ScoreBrand {
  async score(input: ScoreBrandInput): Promise<BrandScorePayload> {
    const brandFit = 0.5 + unitFromId(input.assetId + (input.clientId ?? ""), 5) * 0.45;
    return BrandScorePayloadSchema.parse({
      assetId: input.assetId,
      orgId: input.orgId,
      shootId: input.shootId,
      clientId: input.clientId,
      brandFit: Number(brandFit.toFixed(3)),
      paletteMatch: Number((0.4 + unitFromId(input.assetId, 6) * 0.55).toFixed(3)),
      notes: "Mock brand fit — replace with Gemini vision adapter.",
      model: "mock-score-brand-v1",
    });
  }
}

export class MockGenerateCaption implements GenerateCaption {
  async generate(input: GenerateCaptionInput): Promise<CaptionPayload> {
    const en = "On-brand select — soft light, clean crop, ready for the feed.";
    const hi = "ब्रांड के मुताबिक सिलेक्ट — सॉफ्ट लाइट, साफ़ क्रॉप, फीड के लिए तैयार।";
    return CaptionPayloadSchema.parse({
      assetId: input.assetId,
      orgId: input.orgId,
      shootId: input.shootId,
      locale: input.locale,
      text: input.locale === "hi" ? hi : en,
      tone: input.tone ?? "client-voice",
      model: "mock-generate-caption-v1",
    });
  }
}

export function createMockAi(): CutRoomAi {
  return {
    scoreQuality: new MockScoreQuality(),
    scoreBrand: new MockScoreBrand(),
    generateCaption: new MockGenerateCaption(),
  };
}
