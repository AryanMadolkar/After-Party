import { z } from "zod";

export const PlanIdEnum = z.enum(["studio", "agency", "agency_plus"]);
export type PlanId = z.infer<typeof PlanIdEnum>;

export const PlanLimitCodeEnum = z.enum([
  "PLAN_LIMIT_CLIENTS",
  "PLAN_LIMIT_SEATS",
  "PLAN_LIMIT_IMAGES",
]);
export type PlanLimitCode = z.infer<typeof PlanLimitCodeEnum>;

export type PlanLimits = {
  clients: number;
  seats: number;
  images: number;
};

/** Stub plan ceilings — enforced in later billing/limit slices. */
export const PLAN_LIMITS = {
  studio: { clients: 3, seats: 2, images: 2_000 },
  agency: { clients: 15, seats: 5, images: 15_000 },
  agency_plus: { clients: 40, seats: 15, images: 50_000 },
} as const satisfies Record<PlanId, PlanLimits>;
