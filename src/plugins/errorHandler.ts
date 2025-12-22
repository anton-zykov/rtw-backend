import fp from 'fastify-plugin';
import { AppError, type AppErrorCode } from '#/utils/AppError.js';

export const codeToHttp: Record<AppErrorCode, number> = {
  USER_NOT_FOUND: 404,
  FORBIDDEN: 403,
  VALIDATION: 400,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  INTERNAL: 500,
};

export const errorHandlerPlugin = fp(
  async (app) => {
    app.setErrorHandler((err, req, reply) => {
      if (err instanceof AppError) {
        const status = codeToHttp[err.code] ?? 500;

        return reply.status(status).send({
          code: err.code,
          message: err.message,
          details: err.details,
        });
      }

      if (err.validation) {
        return reply.status(400).send({
          code: 'VALIDATION',
          message: 'Request validation failed',
          details: err.validation,
        });
      }

      req.log.error({ err }, 'Unhandled error');
      return reply.status(500).send({
        code: 'INTERNAL',
        message: 'Internal Server Error',
      });
    });
  }
);
