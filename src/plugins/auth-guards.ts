import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    requireSession: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAdmin: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireStudent: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireOwnerStudent: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export const authGuardPlugin = fp(async (app) => {
  app.decorate(
    'requireSession',
    async function requireSession (request, reply) {
      if (!request.session.userId) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }
    }
  );

  app.decorate(
    'requireAdmin',
    async function requireAdmin (request, reply) {
      if (!request.session.userId) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }
      if (request.session.role !== 'admin') {
        return reply.code(403).send({ message: 'Forbidden' });
      }
    }
  );

  app.decorate(
    'requireStudent',
    async function requireStudent (request, reply) {
      if (!request.session.userId) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }
      if (request.session.role !== 'student') {
        return reply.code(403).send({ message: 'Forbidden' });
      }
    }
  );

  app.decorate(
    'requireOwnerStudent',
    async function requireOwnerStudent (request, reply) {
      if (!request.session.userId) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }
      if (request.session.role !== 'student' || request.session.userId !== (request.body as { studentId?: string }).studentId) {
        return reply.code(403).send({ message: 'Forbidden' });
      }
    }
  );
});
