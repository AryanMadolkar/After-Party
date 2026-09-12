import type { CutRoomAi } from "@/lib/ai/interfaces";
import { createMockAi } from "@/lib/ai/mocks";

/**
 * Gemini vision adapter stub — no live calls in Solo-P3.
 * Wire GOOGLE_GENERATIVE_AI_API_KEY in Solo-P5/P6.
 */
export function createGeminiAiAdapter(): CutRoomAi {
  const mock = createMockAi();
  return {
    scoreQuality: {
      async score(input) {
        // TODO(P6): call Gemini Flash / Pro vision for quality cues.
        return mock.scoreQuality.score(input);
      },
    },
    scoreBrand: {
      async score(input) {
        // TODO(P6): Gemini brand-kit vision compare.
        return mock.scoreBrand.score(input);
      },
    },
    generateCaption: {
      async generate(input) {
        // TODO(P7): Gemini captions EN/HI.
        return mock.generateCaption.generate(input);
      },
    },
  };
}
