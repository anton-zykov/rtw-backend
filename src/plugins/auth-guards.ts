import fp from 'fastify-plugin';
import { findStudentById } from '#/services/student/index.js';
import { AppError } from '#/utils/AppError.js';

declare module 'fastify' {
  interface FastifyInstance {
    requireSession: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAdmin: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireStudent: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireTeacher: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireOwnTeacherOrAdmin: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireOwner: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyReply {
    forbidden: (this: FastifyReply) => Promise<void>;
    unauthorized: (this: FastifyReply) => Promise<void>;
  }
}

export const authGuardPlugin = fp(async (app) => {
  app.decorateReply(
    'forbidden',
    async function forbidden () {
      throw new AppError('FORBIDDEN', 'Forbidden');
    }
  );

  app.decorateReply(
    'unauthorized',
    async function unauthorized () {
      throw new AppError('UNAUTHORIZED', 'Unauthorized');
    }
  );

  app.decorate(
    'requireSession',
    async function requireSession (req, reply) {
      if (!req.session.userId) return reply.unauthorized();
    }
  );

  app.decorate(
    'requireAdmin',
    async function requireAdmin (req, reply) {
      if (!req.session.userId) return reply.unauthorized();
      if (req.session.role !== 'admin') return reply.forbidden();
    }
  );

  app.decorate(
    'requireStudent',
    async function requireStudent (req, reply) {
      if (!req.session.userId) return reply.unauthorized();
      if (req.session.role !== 'student') return reply.forbidden();
    }
  );

  app.decorate(
    'requireTeacher',
    async function requireTeacher (req, reply) {
      if (!req.session.userId) return reply.unauthorized();
      if (req.session.role !== 'teacher') return reply.forbidden();
    }
  );

  app.decorate(
    'requireOwnTeacherOrAdmin',
    async function requireOwnTeacherOrAdmin (req, reply) {
      if (!req.session.userId) return reply.unauthorized();
      if (req.session.role === 'admin') return;
      if (req.session.role !== 'teacher') return reply.forbidden();
      const teacherId = req.session.userId;
      const student = await findStudentById(app.prisma, { id: (req.body as { studentId: string }).studentId });
      if (student?.teacherId !== teacherId) return reply.forbidden();
    }
  );

  app.decorate(
    'requireOwner',
    async function requireOwner (req, reply) {
      if (!req.session.userId) return reply.unauthorized();
      if (req.session.userId !== (req.body as { id?: string }).id) return reply.forbidden();
    }
  );
});
