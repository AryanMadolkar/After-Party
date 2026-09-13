import { z } from "zod";

export const ClientStatusEnum = z.enum(["active", "archived"]);
export type ClientStatus = z.infer<typeof ClientStatusEnum>;

export const ClientSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case."),
  status: ClientStatusEnum,
  externalRef: z.string().max(200).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Client = z.infer<typeof ClientSchema>;

export const CreateClientInput = z.object({
  name: z.string().trim().min(1, "Enter a client name.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case.")
    .optional(),
  externalRef: z.string().trim().max(200).optional(),
});
export type CreateClientInput = z.infer<typeof CreateClientInput>;

export const UpdateClientInput = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  externalRef: z.string().trim().max(200).nullable().optional(),
  status: ClientStatusEnum.optional(),
});
export type UpdateClientInput = z.infer<typeof UpdateClientInput>;

export const CaptionLanguagesSchema = z.union([
  z.tuple([z.literal("en")]),
  z.tuple([z.literal("en"), z.literal("hi")]),
]);
export type CaptionLanguages = z.infer<typeof CaptionLanguagesSchema>;

export const BrandKitSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  clientId: z.string().uuid(),
  primaryColor: z.string().nullable(),
  secondaryColors: z.array(z.string()).default([]),
  logoBlobKey: z.string().nullable(),
  voiceNotes: z.string().nullable(),
  dos: z.array(z.string()).default([]),
  donts: z.array(z.string()).default([]),
  sampleCaptions: z.array(z.string()).default([]),
  captionLanguages: CaptionLanguagesSchema.default(["en"]),
  forbiddenTopics: z.array(z.string()).default([]),
  mustIncludeHints: z.array(z.string()).default([]),
  updatedBy: z.string().uuid().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type BrandKit = z.infer<typeof BrandKitSchema>;

export const UpdateBrandKitInput = z.object({
  primaryColor: z.string().trim().max(32).nullable().optional(),
  secondaryColors: z.array(z.string().trim().max(32)).max(8).optional(),
  logoBlobKey: z.string().trim().max(500).nullable().optional(),
  voiceNotes: z.string().trim().max(4000).nullable().optional(),
  dos: z.array(z.string().trim().max(200)).max(20).optional(),
  donts: z.array(z.string().trim().max(200)).max(20).optional(),
  sampleCaptions: z.array(z.string().trim().max(500)).max(20).optional(),
  captionLanguages: CaptionLanguagesSchema.optional(),
  forbiddenTopics: z.array(z.string().trim().max(120)).max(30).optional(),
  mustIncludeHints: z.array(z.string().trim().max(200)).max(20).optional(),
});
export type UpdateBrandKitInput = z.infer<typeof UpdateBrandKitInput>;

export const BrandKitWarningCodeEnum = z.enum(["MISSING_LOGO", "MISSING_VOICE_NOTES"]);
export type BrandKitWarningCode = z.infer<typeof BrandKitWarningCodeEnum>;

export const BrandKitCompletenessSchema = z.object({
  score: z.number().int().min(0).max(100),
  flags: z.object({
    hasPrimaryColor: z.boolean(),
    hasLogo: z.boolean(),
    hasVoiceNotes: z.boolean(),
    hasDos: z.boolean(),
    hasDonts: z.boolean(),
    hasSampleCaptions: z.boolean(),
    hasHi: z.boolean(),
    hasGuardrails: z.boolean(),
  }),
  softWarnings: z.array(BrandKitWarningCodeEnum),
});
export type BrandKitCompleteness = z.infer<typeof BrandKitCompletenessSchema>;

const COMPLETENESS_WEIGHTS = {
  hasPrimaryColor: 15,
  hasLogo: 20,
  hasVoiceNotes: 20,
  hasDos: 10,
  hasDonts: 10,
  hasSampleCaptions: 10,
  hasHi: 5,
  hasGuardrails: 10,
} as const;

export function computeBrandKitCompleteness(
  kit: Pick<
    BrandKit,
    | "primaryColor"
    | "logoBlobKey"
    | "voiceNotes"
    | "dos"
    | "donts"
    | "sampleCaptions"
    | "captionLanguages"
    | "forbiddenTopics"
    | "mustIncludeHints"
  >,
): BrandKitCompleteness {
  const flags = {
    hasPrimaryColor: Boolean(kit.primaryColor?.trim()),
    hasLogo: Boolean(kit.logoBlobKey?.trim()),
    hasVoiceNotes: Boolean(kit.voiceNotes?.trim()),
    hasDos: (kit.dos?.length ?? 0) > 0,
    hasDonts: (kit.donts?.length ?? 0) > 0,
    hasSampleCaptions: (kit.sampleCaptions?.length ?? 0) > 0,
    hasHi: (kit.captionLanguages ?? ["en"]).length > 1 && (kit.captionLanguages ?? ["en"])[1] === "hi",
    hasGuardrails:
      (kit.forbiddenTopics?.length ?? 0) > 0 || (kit.mustIncludeHints?.length ?? 0) > 0,
  };

  let score = 0;
  for (const [key, weight] of Object.entries(COMPLETENESS_WEIGHTS) as Array<
    [keyof typeof COMPLETENESS_WEIGHTS, number]
  >) {
    if (flags[key]) score += weight;
  }

  const softWarnings: BrandKitWarningCode[] = [];
  if (!flags.hasLogo) softWarnings.push("MISSING_LOGO");
  if (!flags.hasVoiceNotes) softWarnings.push("MISSING_VOICE_NOTES");

  return BrandKitCompletenessSchema.parse({ score, flags, softWarnings });
}
