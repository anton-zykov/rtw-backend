import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { createUser, createStudent, createTeacher, cleanUpUser } from 'test/hooks/index.js';
import { findTeacherById } from '#/services/teacher/index.js';
import { findStudentById } from '#/services/student/index.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/teacher/delete', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('when valid id of a teacher', async () => {
    let teacher: Awaited<ReturnType<typeof createUser>>;
    let student: Awaited<ReturnType<typeof createUser>>;
    beforeAll(async () => {
      teacher = await createUser(app, adminCookie);
      await createTeacher(app, adminCookie, teacher.id);
      student = await createUser(app, adminCookie);
      await createStudent(app, adminCookie, student.id, teacher.id);
    });

    it('then should delete teacher', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/api/teacher/delete',
        payload: {
          id: teacher.id
        },
        headers: {
          cookie: adminCookie
        }
      });

      expect(res.statusCode).toBe(200);
      await expect(findTeacherById(app.prisma, { id: teacher.id })).rejects.toThrow('User not found');
    });

    it('then all connected students should be removed', async () => {
      await expect(findStudentById(app.prisma, { id: student.id })).rejects.toThrow('User not found');
    });

    afterAll(async () => {
      await cleanUpUser(app, adminCookie, teacher.id);
      await cleanUpUser(app, adminCookie, student.id);
    });
  });

  describe('when id is not provided', async () => {
    it('then should return 400 with proper message', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/api/teacher/delete',
        payload: {},
        headers: {
          cookie: adminCookie
        }
      });
      expect(res.statusCode).toBe(400);
      expect(res.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
    });
  });

  describe('when teacher id doesn\'t exist', async () => {
    it('then should return 404 with proper message', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/api/teacher/delete',
        payload: {
          id: 'a2c6858a-130a-42e8-8b87-e89f89c4d887' // non-existent id
        },
        headers: {
          cookie: adminCookie
        }
      });

      expect(res.statusCode).toBe(404);
      expect(res.json()).toStrictEqual({ code: 'USER_NOT_FOUND', message: 'User not found' });
    });
  });
});
