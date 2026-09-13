import { z } from "zod";

export const PlanIdEnum = z.enum(["studio", "agency", "agency_plus"]);
export type PlanId = z.infer<typeof PlanIdEnum>;

export const PlanLimitCodeEnum = z.enum([
  "PLAN_LIMIT_CLIENTS",
  "PLAN_LIMIT_SEATS",
  "PLAN_LIMIT_IMAGES",
]);
export type PlanLimitCode = z.infer<typeof PlanLimitCodeEnum>;

export const PlanLimitsSchema = z.object({
  clients: z.number().int().positive(),
  seats: z.number().int().positive(),
  images: z.number().int().positive(),
});
export type PlanLimits = z.infer<typeof PlanLimitsSchema>;

/** §19.1 plan ceilings — enforced on client create (and later seats/images). */
export const PLAN_LIMITS = {
  studio: { clients: 3, seats: 2, images: 2_000 },
  agency: { clients: 15, seats: 5, images: 15_000 },
  agency_plus: { clients: 40, seats: 15, images: 50_000 },
} as const satisfies Record<PlanId, PlanLimits>;

export function getPlanLimits(planId: PlanId): PlanLimits {
  return PLAN_LIMITS[planId];
}

export class PlanLimitError extends Error {
  readonly code: PlanLimitCode;
  readonly status = 403 as const;

  constructor(code: PlanLimitCode, message?: string) {
    super(message ?? code);
    this.name = "PlanLimitError";
    this.code = code;
  }
}

export function isPlanLimitError(error: unknown): error is PlanLimitError {
  return error instanceof PlanLimitError;
}
