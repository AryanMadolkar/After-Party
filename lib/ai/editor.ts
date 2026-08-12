import type { EditResult } from "@/lib/ai/types";

export interface AIEditorService {
  applyEditPrompt(input: { photoUrl: string; prompt: string }): Promise<EditResult>;
}

/**
 * Mocked implementation. Generative/AI-driven editing (e.g. "remove the
 * person in the background") is out of scope for this foundation — this
 * echoes the prompt back with the original image so the UI can be built
 * end-to-end against a stable contract before the real model is wired in.
 */
class MockAIEditorService implements AIEditorService {
  async applyEditPrompt(input: { photoUrl: string; prompt: string }): Promise<EditResult> {
    return {
      previewUrl: input.photoUrl,
      summary: `AI editing isn't connected yet — once it is, this will apply: "${input.prompt}"`,
      appliedAdjustments: {},
    };
  }
}

export const aiEditorService: AIEditorService = new MockAIEditorService();
