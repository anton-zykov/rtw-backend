import z from 'zod';

export const APP_ERROR_CODES = [
  'USER_NOT_FOUND',
  'FORBIDDEN',
  'VALIDATION',
  'CONFLICT',
  'UNAUTHORIZED',
  'INTERNAL',
] as const;

export type AppErrorCode = typeof APP_ERROR_CODES[number];

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly details?: unknown;

  constructor (code: AppErrorCode, message?: string, details?: unknown) {
    super(message ?? code);
    this.code = code;
    this.details = details;
  }
}

export const AppErrorSchema = z.object({
  code: z.enum(APP_ERROR_CODES),
  message: z.string(),
  // Can be used to debug
  // details: z.unknown().optional(),
});
