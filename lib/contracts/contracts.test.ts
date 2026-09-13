import { describe, expect, it } from "vitest";

import {
  CreateOrgInput,
  MembershipSchema,
  OrgPublic,
  OrgSchema,
  PLAN_LIMITS,
  PlanIdEnum,
  RoleEnum,
} from "@/lib/contracts";

describe("lib/contracts", () => {
  it("exports PlanId / Role enums", () => {
    expect(PlanIdEnum.options).toEqual(["studio", "agency", "agency_plus"]);
    expect(RoleEnum.options).toEqual(["owner", "producer", "editor"]);
  });

  it("exposes PLAN_LIMITS §19.1 ceilings", () => {
    expect(PLAN_LIMITS.studio).toEqual({ clients: 3, seats: 2, images: 2_000 });
    expect(PLAN_LIMITS.agency).toEqual({ clients: 15, seats: 5, images: 15_000 });
    expect(PLAN_LIMITS.agency_plus).toEqual({ clients: 40, seats: 15, images: 50_000 });
  });

  it("parses Org / Membership / CreateOrgInput / OrgPublic", () => {
    const now = new Date();
    const org = OrgSchema.parse({
      id: "11111111-1111-4111-8111-111111111111",
      name: "Acme Studio",
      slug: "acme-studio",
      planId: "studio",
      createdAt: now,
      updatedAt: now,
    });
    expect(OrgPublic.parse(org)).toEqual({
      id: org.id,
      name: org.name,
      slug: org.slug,
      planId: "studio",
    });

    expect(
      MembershipSchema.parse({
        id: "22222222-2222-4222-8222-222222222222",
        orgId: org.id,
        userId: "33333333-3333-4333-8333-333333333333",
        role: "owner",
        createdAt: now,
        updatedAt: now,
      }).role,
    ).toBe("owner");

    expect(CreateOrgInput.parse({ name: "Acme Studio" }).name).toBe("Acme Studio");
  });
});
