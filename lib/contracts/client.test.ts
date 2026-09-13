import { describe, expect, it } from "vitest";

import {
  BrandKitSchema,
  ClientSchema,
  CreateClientInput,
  PLAN_LIMITS,
  PlanLimitsSchema,
  UpdateBrandKitInput,
  computeBrandKitCompleteness,
} from "@/lib/contracts";

describe("client + brand kit contracts", () => {
  const now = new Date("2026-09-12T12:00:00.000Z");
  const ids = {
    id: "11111111-1111-4111-8111-111111111111",
    orgId: "22222222-2222-4222-8222-222222222222",
    clientId: "33333333-3333-4333-8333-333333333333",
    userId: "44444444-4444-4444-8444-444444444444",
  };

  it("parses ClientSchema and CreateClientInput", () => {
    const client = ClientSchema.parse({
      id: ids.id,
      orgId: ids.orgId,
      name: "Acme",
      slug: "acme",
      status: "active",
      externalRef: null,
      createdAt: now,
      updatedAt: now,
    });
    expect(client.slug).toBe("acme");
    expect(CreateClientInput.parse({ name: "Acme" }).name).toBe("Acme");
  });

  it("PLAN_LIMITS match §19.1 and PlanLimitsSchema", () => {
    expect(PlanLimitsSchema.parse(PLAN_LIMITS.studio)).toEqual({
      clients: 3,
      seats: 2,
      images: 2_000,
    });
    expect(PLAN_LIMITS.agency.clients).toBe(15);
    expect(PLAN_LIMITS.agency_plus.clients).toBe(40);
  });

  it("persists all US-02 brand kit fields via BrandKitSchema", () => {
    const kit = BrandKitSchema.parse({
      id: ids.id,
      orgId: ids.orgId,
      clientId: ids.clientId,
      primaryColor: "#0F766E",
      secondaryColors: ["#C45C26"],
      logoBlobKey: "orgs/x/logo",
      voiceNotes: "Warm hospitality",
      dos: ["Mention chef"],
      donts: ["No politics"],
      sampleCaptions: ["Sunday brunch is open."],
      captionLanguages: ["en", "hi"],
      forbiddenTopics: ["politics"],
      mustIncludeHints: ["location tag"],
      updatedBy: ids.userId,
      createdAt: now,
      updatedAt: now,
    });
    expect(kit.captionLanguages).toEqual(["en", "hi"]);
    expect(kit.mustIncludeHints).toEqual(["location tag"]);
  });

  it("completeness meter + soft warnings for logo/voiceNotes", () => {
    const empty = computeBrandKitCompleteness({
      primaryColor: null,
      logoBlobKey: null,
      voiceNotes: null,
      dos: [],
      donts: [],
      sampleCaptions: [],
      captionLanguages: ["en"],
      forbiddenTopics: [],
      mustIncludeHints: [],
    });
    expect(empty.score).toBe(0);
    expect(empty.softWarnings).toEqual(["MISSING_LOGO", "MISSING_VOICE_NOTES"]);

    const fuller = computeBrandKitCompleteness({
      primaryColor: "#0F766E",
      logoBlobKey: "logo",
      voiceNotes: "Voice",
      dos: ["Do"],
      donts: ["Dont"],
      sampleCaptions: ["Hi"],
      captionLanguages: ["en", "hi"],
      forbiddenTopics: ["x"],
      mustIncludeHints: [],
    });
    expect(fuller.score).toBe(100);
    expect(fuller.flags.hasHi).toBe(true);
    expect(fuller.softWarnings).toEqual([]);
  });

  it("UpdateBrandKitInput accepts HI toggle payload", () => {
    expect(UpdateBrandKitInput.parse({ captionLanguages: ["en"] }).captionLanguages).toEqual([
      "en",
    ]);
    expect(
      UpdateBrandKitInput.parse({ captionLanguages: ["en", "hi"] }).captionLanguages,
    ).toEqual(["en", "hi"]);
  });
});
