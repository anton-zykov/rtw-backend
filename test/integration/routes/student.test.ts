import { randomUUID } from 'crypto';
import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { createTeacher, createStudent, createUser, cleanUpUser } from 'test/hooks/index.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/student', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('/create', () => {
    describe('when valid id of a user without a role', async () => {
      it.todo('then should create student', async () => {});
    });

    describe('when id is not provided', async () => {
      it.todo('then should return 400 with proper message', async () => {});
    });

    describe('when user id doesn\'t exist', async () => {
      it.todo('then should return 404 with proper message', async () => {});
    });

    describe('when user is already an admin', async () => {
      it.todo('then should return 400 with proper message', async () => {});
    });

    describe('when user is already a student', async () => {
      it.todo('', async () => {});
    });
  });

  describe('PATCH /update-task-types', () => {
    describe('when modifying task types', () => {
      it('then should update task types to the given state and return 200', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const res1 = await app.inject({
          method: 'PATCH',
          url: '/api/student/update-task-types',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            taskTypes: ['genitive', 'adverbs'],
          },
        });

        expect(res1.statusCode).toBe(200);

        const updated1 = await app.prisma.student.findUniqueOrThrow({
          where: { id: student.id },
        });
        expect(updated1.taskTypes).toContain('genitive');
        expect(updated1.taskTypes).toContain('adverbs');
        expect(updated1.taskTypes).toHaveLength(2);

        const res2 = await app.inject({
          method: 'PATCH',
          url: '/api/student/update-task-types',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            taskTypes: ['adverbs', 'stress'],
          },
        });

        expect(res2.statusCode).toBe(200);

        const updated2 = await app.prisma.student.findUniqueOrThrow({
          where: { id: student.id },
        });
        expect(updated2.taskTypes).toContain('adverbs');
        expect(updated2.taskTypes).toContain('stress');
        expect(updated2.taskTypes).toHaveLength(2);

        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when student id doesn\'t exist', () => {
      it('then should return 404 with USER_NOT_FOUND', async () => {
        const nonExistentStudentId = randomUUID();

        const res = await app.inject({
          method: 'PATCH',
          url: '/api/student/update-task-types',
          headers: { Cookie: adminCookie },
          body: {
            studentId: nonExistentStudentId,
            taskTypes: ['genitive'],
          },
        });

        expect(res.statusCode).toBe(404);
        const body = await res.json() as { code: string };
        expect(body.code).toBe('USER_NOT_FOUND');
      });
    });
  });
});
