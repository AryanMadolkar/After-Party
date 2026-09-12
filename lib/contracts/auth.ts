import { z } from "zod";

export const SessionUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;

export const AuthErrorCodeEnum = z.enum(["UNAUTHORIZED", "FORBIDDEN"]);
export type AuthErrorCode = z.infer<typeof AuthErrorCodeEnum>;

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  readonly status: 401 | 403;

  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AuthError";
    this.code = code;
    this.status = code === "UNAUTHORIZED" ? 401 : 403;
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
