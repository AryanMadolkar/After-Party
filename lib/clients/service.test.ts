import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthError, PlanLimitError } from "@/lib/contracts";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/tenancy", () => ({
  getSession: vi.fn(),
  listCurrentMemberships: vi.fn(),
  assertOrgMember: vi.fn(),
}));

vi.mock("@/lib/db/queries/organizations", () => ({
  getOrganizationById: vi.fn(),
}));

vi.mock("@/lib/db/mutations/audit-logs", () => ({
  insertAuditLog: vi.fn(),
}));

vi.mock("@/lib/db/mutations/clients", () => ({
  countActiveClients: vi.fn(),
  getClientByOrgSlug: vi.fn(),
  insertBrandKit: vi.fn(),
  insertClient: vi.fn(),
  updateBrandKitRow: vi.fn(),
  updateClientRow: vi.fn(),
}));

vi.mock("@/lib/db/queries/clients", () => ({
  getBrandKitForClient: vi.fn(),
  getClientForOrg: vi.fn(),
  listClientsForOrg: vi.fn(),
}));

import { assertOrgMember, getSession, listCurrentMemberships } from "@/lib/auth/tenancy";
import {
  createClient,
  getBrandKit,
  updateBrandKit,
} from "@/lib/clients/service";
import { insertAuditLog } from "@/lib/db/mutations/audit-logs";
import {
  countActiveClients,
  getClientByOrgSlug,
  insertBrandKit,
  insertClient,
  updateBrandKitRow,
} from "@/lib/db/mutations/clients";
import { getBrandKitForClient, getClientForOrg } from "@/lib/db/queries/clients";
import { getOrganizationById } from "@/lib/db/queries/organizations";

const getSessionMock = vi.mocked(getSession);
const listMembershipsMock = vi.mocked(listCurrentMemberships);
const assertOrgMemberMock = vi.mocked(assertOrgMember);
const getOrgMock = vi.mocked(getOrganizationById);
const countActiveMock = vi.mocked(countActiveClients);
const getBySlugMock = vi.mocked(getClientByOrgSlug);
const insertClientMock = vi.mocked(insertClient);
const insertKitMock = vi.mocked(insertBrandKit);
const getClientMock = vi.mocked(getClientForOrg);
const getKitMock = vi.mocked(getBrandKitForClient);
const updateKitMock = vi.mocked(updateBrandKitRow);
const auditMock = vi.mocked(insertAuditLog);

const ORG = "11111111-1111-4111-8111-111111111111";
const USER = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const CLIENT = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const KIT = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const OTHER_ORG = "22222222-2222-4222-8222-222222222222";
const now = new Date("2026-09-12T00:00:00.000Z");

function session() {
  return { id: USER, email: "a@example.com", name: "A" };
}

function membership(role: "owner" | "producer" | "editor" = "owner") {
  return {
    id: "33333333-3333-4333-8333-333333333333",
    orgId: ORG,
    userId: USER,
    role,
    createdAt: now,
    updatedAt: now,
  };
}

function org(planId: "studio" | "agency" | "agency_plus" = "studio") {
  return {
    id: ORG,
    name: "Desk",
    slug: "desk",
    planId,
    createdAt: now,
    updatedAt: now,
  };
}

function clientRow(overrides: Record<string, unknown> = {}) {
  return {
    id: CLIENT,
    orgId: ORG,
    name: "Acme",
    slug: "acme",
    status: "active" as const,
    externalRef: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function kitRow(overrides: Record<string, unknown> = {}) {
  return {
    id: KIT,
    orgId: ORG,
    clientId: CLIENT,
    primaryColor: null,
    secondaryColors: [] as string[],
    logoBlobKey: null,
    voiceNotes: null,
    dos: [] as string[],
    donts: [] as string[],
    sampleCaptions: [] as string[],
    captionLanguages: ["en"] as Array<"en" | "hi">,
    forbiddenTopics: [] as string[],
    mustIncludeHints: [] as string[],
    updatedBy: USER,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("clients service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session());
    listMembershipsMock.mockResolvedValue([membership()]);
    assertOrgMemberMock.mockResolvedValue(membership());
    getOrgMock.mockResolvedValue(org("studio"));
    getBySlugMock.mockResolvedValue(null);
    auditMock.mockResolvedValue({
      id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      orgId: ORG,
      actorUserId: USER,
      action: "x",
      targetType: null,
      targetId: null,
      metadata: null,
      createdAt: now,
    });
  });

  it("throws PLAN_LIMIT_CLIENTS on Studio 4th active client", async () => {
    countActiveMock.mockResolvedValue(3);
    await expect(createClient({ name: "Fourth" })).rejects.toBeInstanceOf(PlanLimitError);
    await expect(createClient({ name: "Fourth" })).rejects.toMatchObject({
      code: "PLAN_LIMIT_CLIENTS",
      status: 403,
    });
    expect(insertClientMock).not.toHaveBeenCalled();
  });

  it("creates client + brand kit under plan", async () => {
    countActiveMock.mockResolvedValue(2);
    insertClientMock.mockResolvedValue(clientRow());
    insertKitMock.mockResolvedValue(kitRow());
    const result = await createClient({ name: "Acme" });
    expect(result.client.name).toBe("Acme");
    expect(result.brandKit.clientId).toBe(CLIENT);
    expect(result.completeness.softWarnings).toContain("MISSING_LOGO");
  });

  it("blocks editor from updateBrandKit", async () => {
    listMembershipsMock.mockResolvedValue([membership("editor")]);
    assertOrgMemberMock.mockRejectedValue(
      new AuthError("FORBIDDEN", "Insufficient role for this organization."),
    );
    await expect(
      updateBrandKit(CLIENT, { voiceNotes: "Nope" }),
    ).rejects.toBeInstanceOf(AuthError);
    expect(updateKitMock).not.toHaveBeenCalled();
  });

  it("fails cross-tenant getBrandKit when client not in org", async () => {
    getClientMock.mockResolvedValue(null);
    await expect(getBrandKit(CLIENT)).rejects.toBeInstanceOf(AuthError);
    expect(getKitMock).not.toHaveBeenCalled();
  });

  it("audits brand_kit.updated on kit save", async () => {
    getClientMock.mockResolvedValue(clientRow());
    getKitMock.mockResolvedValue(kitRow());
    updateKitMock.mockResolvedValue(
      kitRow({ voiceNotes: "Warm", logoBlobKey: "logo", primaryColor: "#0F766E" }),
    );
    await updateBrandKit(CLIENT, {
      voiceNotes: "Warm",
      logoBlobKey: "logo",
      primaryColor: "#0F766E",
    });
    expect(auditMock).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "brand_kit.updated",
        targetType: "brand_kit",
        targetId: KIT,
      }),
    );
  });

  it("does not trust clientId without org join on update", async () => {
    getClientMock.mockResolvedValue(null);
    await expect(
      updateBrandKit(CLIENT, { voiceNotes: "x" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    // Even if a kit existed under another org, we never reach update without org client.
    getClientMock.mockResolvedValue(clientRow({ orgId: OTHER_ORG }));
    // getClientForOrg returns null when org mismatch — simulate that path.
    getClientMock.mockResolvedValue(null);
    await expect(updateBrandKit(CLIENT, { voiceNotes: "x" })).rejects.toBeInstanceOf(AuthError);
  });
});
