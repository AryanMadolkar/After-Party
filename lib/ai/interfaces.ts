import type {
  AssetScorePayload,
  BrandScorePayload,
  CaptionPayload,
} from "@/lib/contracts";

export type ScoreQualityInput = {
  orgId: string;
  shootId: string;
  assetId: string;
  /** Public or signed image URL — unused by mocks. */
  imageUrl?: string;
};

export type ScoreBrandInput = ScoreQualityInput & {
  clientId?: string;
  brandKitId?: string;
};

export type GenerateCaptionInput = {
  orgId: string;
  shootId: string;
  assetId?: string;
  locale: "en" | "hi";
  tone?: string;
  brandVoice?: string;
};

/** Quality / technical scoring for a shoot asset. */
export interface ScoreQuality {
  score(input: ScoreQualityInput): Promise<AssetScorePayload>;
}

/** Brand-fit scoring against a client kit. */
export interface ScoreBrand {
  score(input: ScoreBrandInput): Promise<BrandScorePayload>;
}

/** Client-voice caption generation (EN/HI). */
export interface GenerateCaption {
  generate(input: GenerateCaptionInput): Promise<CaptionPayload>;
}

export type CutRoomAi = {
  scoreQuality: ScoreQuality;
  scoreBrand: ScoreBrand;
  generateCaption: GenerateCaption;
};
