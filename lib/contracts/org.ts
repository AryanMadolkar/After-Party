import { z } from "zod";

import { PlanIdEnum } from "./plan";

export const RoleEnum = z.enum(["owner", "producer", "editor"]);
export type Role = z.infer<typeof RoleEnum>;

export const OrgSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case."),
  planId: PlanIdEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Org = z.infer<typeof OrgSchema>;

export const OrgPublic = OrgSchema.pick({
  id: true,
  name: true,
  slug: true,
  planId: true,
});
export type OrgPublic = z.infer<typeof OrgPublic>;

export const CreateOrgInput = z.object({
  name: z.string().trim().min(1, "Enter an organization name.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case.")
    .optional(),
  planId: PlanIdEnum.optional(),
});
export type CreateOrgInput = z.infer<typeof CreateOrgInput>;

export const MembershipSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  userId: z.string().uuid(),
  role: RoleEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Membership = z.infer<typeof MembershipSchema>;
