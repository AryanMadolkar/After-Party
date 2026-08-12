import type { CaptionStyle } from "@/lib/ai/types";

export interface CaptionService {
  generateCaptions(input: {
    projectName: string;
    style: CaptionStyle;
    count?: number;
  }): Promise<string[]>;
}

const TEMPLATES: Record<Exclude<CaptionStyle, "none">, (name: string) => string[]> = {
  minimal: (name) => [`${name}.`, `${name}, in frames.`, `moments from ${name}.`],
  funny: (name) => [
    `${name}: 300 photos, 10 survivors.`,
    `proof I have a personality outside of ${name} group chats.`,
    `${name} — send this to whoever's asking where I've been.`,
  ],
  story: (name) => [
    `every trip leaves with more than photos. ${name} left with all of it.`,
    `some places you visit. ${name} stayed with us.`,
    `the short version of ${name} — the long version is in the camera roll.`,
  ],
  casual: (name) => [`${name} recap 🫶`, `bits and pieces from ${name}`, `${name}, basically.`],
  romantic: (name) => [
    `${name}, with you — that's the whole caption.`,
    `every version of us, from ${name}.`,
    `still thinking about ${name}.`,
  ],
};

/**
 * Mocked implementation. Returns a small set of template-based captions
 * per style. A real implementation will call an LLM with the project's
 * photos/context — the signature already anticipates that (project name is
 * a stand-in for a richer "trip context" object that the analysis pipeline
 * will eventually produce).
 */
class MockCaptionService implements CaptionService {
  async generateCaptions(input: {
    projectName: string;
    style: CaptionStyle;
    count?: number;
  }): Promise<string[]> {
    if (input.style === "none") return [];
    const options = TEMPLATES[input.style](input.projectName || "this one");
    return options.slice(0, input.count ?? options.length);
  }
}

export const captionService: CaptionService = new MockCaptionService();
