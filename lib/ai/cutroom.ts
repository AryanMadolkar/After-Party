import { createMockAi } from "@/lib/ai/mocks";
import { createGeminiAiAdapter } from "@/lib/ai/adapters/gemini";
import { createOpenAiAiAdapter } from "@/lib/ai/adapters/openai";
import type { CutRoomAi } from "@/lib/ai/interfaces";

export type { CutRoomAi, ScoreQuality, ScoreBrand, GenerateCaption } from "@/lib/ai/interfaces";
export { createMockAi, MockScoreQuality, MockScoreBrand, MockGenerateCaption } from "@/lib/ai/mocks";
export { createGeminiAiAdapter } from "@/lib/ai/adapters/gemini";
export { createOpenAiAiAdapter } from "@/lib/ai/adapters/openai";

/**
 * Default AI provider for CutRoom. Solo-P3 always returns mocks unless
 * CUTROOM_AI_PROVIDER is set to gemini|openai (still stubbed, no live HTTP).
 */
export function getCutRoomAi(): CutRoomAi {
  const provider = process.env.CUTROOM_AI_PROVIDER?.toLowerCase();
  if (provider === "gemini") return createGeminiAiAdapter();
  if (provider === "openai") return createOpenAiAiAdapter();
  return createMockAi();
}
