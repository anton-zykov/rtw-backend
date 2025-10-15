import { z } from 'zod';
import type { FastifyZodInstance } from '#/server.js';

const HealthReply = z.object({
  status: z.string().regex(/^ok$/),
});

export async function healthRoutes (app: FastifyZodInstance) {
  app.get('/health', {
    schema: {
      response: {
        200: HealthReply,
      },
    }
  }, async () => ({ status: 'ok' }));
}
