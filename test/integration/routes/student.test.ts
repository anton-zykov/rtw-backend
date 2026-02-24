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
    describe('when adding a task type', () => {
      it('then should add task type and return 200', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const res = await app.inject({
          method: 'PATCH',
          url: '/api/student/update-task-types',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            action: 'add',
            taskType: 'genitive',
          },
        });

        expect(res.statusCode).toBe(200);

        const updated = await app.prisma.student.findUniqueOrThrow({
          where: { id: student.id },
        });
        expect(updated.taskTypes).toContain('genitive');

        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when removing a task type', () => {
      it('then should remove task type and return 200', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        await app.prisma.student.update({
          where: { id: student.id },
          data: { taskTypes: ['genitive', 'stress'] },
        });

        const res = await app.inject({
          method: 'PATCH',
          url: '/api/student/update-task-types',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            action: 'remove',
            taskType: 'genitive',
          },
        });

        expect(res.statusCode).toBe(200);

        const updated = await app.prisma.student.findUniqueOrThrow({
          where: { id: student.id },
        });
        expect(updated.taskTypes).not.toContain('genitive');
        expect(updated.taskTypes).toContain('stress');

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
            action: 'add',
            taskType: 'genitive',
          },
        });

        expect(res.statusCode).toBe(404);
        const body = await res.json() as { code: string };
        expect(body.code).toBe('USER_NOT_FOUND');
      });
    });

    describe('when adding task type student already has', () => {
      it('then should return 200 and remain idempotent', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        await app.prisma.student.update({
          where: { id: student.id },
          data: { taskTypes: ['genitive'] },
        });

        const res = await app.inject({
          method: 'PATCH',
          url: '/api/student/update-task-types',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            action: 'add',
            taskType: 'genitive',
          },
        });

        expect(res.statusCode).toBe(200);

        const updated = await app.prisma.student.findUniqueOrThrow({
          where: { id: student.id },
        });
        expect(updated.taskTypes).toEqual(['genitive']);

        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when removing task type student doesn\'t have', () => {
      it('then should return 200 and remain idempotent', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const res = await app.inject({
          method: 'PATCH',
          url: '/api/student/update-task-types',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            action: 'remove',
            taskType: 'genitive',
          },
        });

        expect(res.statusCode).toBe(200);

        const updated = await app.prisma.student.findUniqueOrThrow({
          where: { id: student.id },
        });
        expect(updated.taskTypes).toEqual([]);

        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });
  });
});
