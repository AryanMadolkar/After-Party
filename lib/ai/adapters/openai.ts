import type { CutRoomAi } from "@/lib/ai/interfaces";
import { createMockAi } from "@/lib/ai/mocks";

/**
 * OpenAI (GPT-4o-mini) adapter stub — no live calls in Solo-P3.
 * Wire OPENAI_API_KEY in Solo-P5/P6 (OQ-01/OQ-02 fallback / captions).
 */
export function createOpenAiAiAdapter(): CutRoomAi {
  const mock = createMockAi();
  return {
    scoreQuality: {
      async score(input) {
        // TODO(P6): GPT-4o-mini vision quality.
        return mock.scoreQuality.score(input);
      },
    },
    scoreBrand: {
      async score(input) {
        // TODO(P6): GPT-4o-mini brand fit.
        return mock.scoreBrand.score(input);
      },
    },
    generateCaption: {
      async generate(input) {
        // TODO(P7): GPT-4o-mini captions EN/HI.
        return mock.generateCaption.generate(input);
      },
    },
  };
}
