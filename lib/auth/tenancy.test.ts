import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthError } from "@/lib/contracts";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/auth/current-user", () => ({
  getCurrentUser: vi.fn(),
  requireCurrentUser: vi.fn(),
}));

vi.mock("@/lib/db/queries/memberships", () => ({
  getMembershipForUser: vi.fn(),
  listMembershipsForUser: vi.fn(),
}));

vi.mock("@/lib/db/mutations/organizations", () => ({
  createOrganizationRow: vi.fn(),
}));

vi.mock("@/lib/db/queries/organizations", () => ({
  getOrganizationBySlug: vi.fn(),
}));

vi.mock("@/lib/db/mutations/memberships", () => ({
  createMembershipRow: vi.fn(),
}));

vi.mock("@/lib/db/mutations/audit-logs", () => ({
  insertAuditLog: vi.fn(),
}));

import { getCurrentUser } from "@/lib/auth/current-user";
import { assertOrgMember } from "@/lib/auth/tenancy";
import { getMembershipForUser } from "@/lib/db/queries/memberships";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const getMembershipForUserMock = vi.mocked(getMembershipForUser);

const ORG_A = "11111111-1111-4111-8111-111111111111";
const ORG_B = "22222222-2222-4222-8222-222222222222";
const USER_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

function membership(overrides: Partial<{
  id: string;
  orgId: string;
  userId: string;
  role: "owner" | "producer" | "editor";
}> = {}) {
  const now = new Date("2026-01-15T00:00:00.000Z");
  return {
    id: "33333333-3333-4333-8333-333333333333",
    orgId: ORG_A,
    userId: USER_A,
    role: "owner" as const,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("assertOrgMember", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows a member of the org", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: USER_A,
      email: "a@example.com",
      passwordHash: null,
      name: "A",
      avatarUrl: null,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    getMembershipForUserMock.mockResolvedValue(membership());

    const result = await assertOrgMember(ORG_A);
    expect(result.orgId).toBe(ORG_A);
    expect(result.role).toBe("owner");
    expect(getMembershipForUserMock).toHaveBeenCalledWith(ORG_A, USER_A);
  });

  it("allows when role is in the allowed list", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: USER_A,
      email: "a@example.com",
      passwordHash: null,
      name: "A",
      avatarUrl: null,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    getMembershipForUserMock.mockResolvedValue(membership({ role: "editor" }));

    await expect(assertOrgMember(ORG_A, ["owner", "editor"])).resolves.toMatchObject({
      role: "editor",
    });
  });

  it("denies wrong role with 403", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: USER_A,
      email: "a@example.com",
      passwordHash: null,
      name: "A",
      avatarUrl: null,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    getMembershipForUserMock.mockResolvedValue(membership({ role: "editor" }));

    await expect(assertOrgMember(ORG_A, ["owner"])).rejects.toSatisfy((err: unknown) => {
      return err instanceof AuthError && err.code === "FORBIDDEN" && err.status === 403;
    });
  });

  it("denies cross-tenant access: Org A user cannot assert on Org B", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: USER_A,
      email: "a@example.com",
      passwordHash: null,
      name: "A",
      avatarUrl: null,
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Lookup for Org B returns null — user only belongs to Org A.
    getMembershipForUserMock.mockImplementation(async (orgId, userId) => {
      if (orgId === ORG_A && userId === USER_A) return membership();
      return null;
    });

    await expect(assertOrgMember(ORG_B)).rejects.toSatisfy((err: unknown) => {
      return err instanceof AuthError && err.code === "FORBIDDEN" && err.status === 403;
    });
    expect(getMembershipForUserMock).toHaveBeenCalledWith(ORG_B, USER_A);
  });

  it("denies unsigned-in callers with 401", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    await expect(assertOrgMember(ORG_A)).rejects.toSatisfy((err: unknown) => {
      return err instanceof AuthError && err.code === "UNAUTHORIZED" && err.status === 401;
    });
    expect(getMembershipForUserMock).not.toHaveBeenCalled();
  });
});
