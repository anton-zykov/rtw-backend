import { loginSuperAdminAndGetCookie, loginAsUserAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { createUser, createStudent, createTeacher, cleanUpUser } from 'test/hooks/index.js';
import { findTeacherById } from '#/services/teacher/index.js';
import { findStudentById } from '#/services/student/index.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/teacher', () => {
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
      it('then should create teacher', async () => {
        const user = await createUser(app, adminCookie);

        const res = await app.inject({
          method: 'POST',
          url: '/api/teacher/create',
          payload: {
            id: user.id
          },
          headers: {
            cookie: adminCookie
          }
        });

        expect(res.statusCode).toBe(201);
        expect(res.json()).toStrictEqual({ id: user.id });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when valid id is not provided', async () => {
      it('then should receive 400 with proper message', async () => {
        const resNoId = await app.inject({
          method: 'POST',
          url: '/api/teacher/create',
          payload: {},
          headers: {
            cookie: adminCookie
          }
        });

        expect(resNoId.statusCode).toBe(400);
        expect(resNoId.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });

        const resInvalidType = await app.inject({
          method: 'POST',
          url: '/api/teacher/create',
          payload: {
            id: 1234
          },
          headers: {
            cookie: adminCookie
          }
        });

        expect(resInvalidType.statusCode).toBe(400);
        expect(resInvalidType.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
      });
    });

    describe('when user id is valid but doesn\'t exist', async () => {
      it('then should return 404 with proper message', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/teacher/create',
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

    describe('when user is already someone else', async () => {
      it('then should return 409 with proper message', async () => {
        const user = await createUser(app, adminCookie);

        await app.inject({
          method: 'POST',
          url: '/api/admin/create',
          payload: {
            id: user.id
          },
          headers: {
            cookie: adminCookie
          }
        });

        const res = await app.inject({
          method: 'POST',
          url: '/api/teacher/create',
          payload: {
            id: user.id
          },
          headers: {
            cookie: adminCookie
          }
        });

        expect(res.statusCode).toBe(409);
        expect(res.json()).toStrictEqual({ code: 'CONFLICT', message: 'The user already has other role' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });

    describe('when user is already a teacher', async () => {
      it('then should return 409 with proper message', async () => {
        const user = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, user.id);

        const res = await app.inject({
          method: 'POST',
          url: '/api/teacher/create',
          payload: {
            id: user.id
          },
          headers: {
            cookie: adminCookie
          }
        });

        expect(res.statusCode).toBe(409);
        expect(res.json()).toStrictEqual({ code: 'CONFLICT', message: 'The user is already teacher' });

        await cleanUpUser(app, adminCookie, user.id);
      });
    });
  });

  describe('/delete', () => {
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

  describe('GET /my-students/:teacherId', () => {
    describe('when teacher is logged in and has students', () => {
      it('then should return 200 with list of students', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const teacherCookie = await loginAsUserAndGetCookie(app, teacherUser.login, 'correct-password');

        const res = await app.inject({
          method: 'GET',
          url: `/api/teacher/my-students/${teacherUser.id}`,
          headers: {
            cookie: teacherCookie
          }
        });

        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body).toHaveLength(1);
        expect(body[0]).toMatchObject({
          id: student.id,
          login: studentUser.login,
          active: true,
          fullName: studentUser.fullName,
          email: studentUser.email,
          telegramId: studentUser.telegramId,
          taskTypes: ['tricky']
        });

        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when teacher is logged in and has no students', () => {
      it('then should return 200 with empty array', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const teacherCookie = await loginAsUserAndGetCookie(app, teacherUser.login, 'correct-password');

        const res = await app.inject({
          method: 'GET',
          url: `/api/teacher/my-students/${teacherUser.id}`,
          headers: {
            cookie: teacherCookie
          }
        });

        expect(res.statusCode).toBe(200);
        expect(res.json()).toStrictEqual([]);

        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });
  });

  describe('/disable', () => {
    describe('when valid id of a teacher', async () => {
      it.todo('then user should have disabled status and not be able to login', async () => {});
      it.todo('then all connected students should remain but not be able to login', async () => {});
      it.todo('then all connected tasks should remain', async () => {});
    });

    describe('when id is not provided', async () => {
      it.todo('then should return 400 with proper message', async () => {});
    });

    describe('when teacher id doesn\'t exist', async () => {
      it.todo('then should return 404 with proper message', async () => {});
    });
  });
});
