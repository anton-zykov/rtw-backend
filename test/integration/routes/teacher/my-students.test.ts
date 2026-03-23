import { loginSuperAdminAndGetCookie, loginAsUserAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { createUser, createStudent, createTeacher, cleanUpUser } from 'test/hooks/index.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('GET /teacher/my-students/:teacherId', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('when teacher has students', () => {
    it('then should return 200 with list of 1 student', async () => {
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
      expect(body[0]).toStrictEqual({
        id: student.id,
        login: studentUser.login,
        age: 0,
        active: true,
        fullName: studentUser.fullName,
        email: studentUser.email,
        telegramId: studentUser.telegramId,
        taskTypes: ['tricky'],
        adverbsTrainings: [],
        genitiveTrainings: [],
        stressTrainings: [],
        trickyTrainings: []
      });

      await cleanUpUser(app, adminCookie, studentUser.id);
      await cleanUpUser(app, adminCookie, teacherUser.id);
    });
  });
});
