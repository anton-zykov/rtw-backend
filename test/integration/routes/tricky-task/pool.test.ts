import { randomUUID } from 'crypto';
import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { trickyTasks } from 'test/fixtures/tricky-tasks.js';
import { cleanUpTrickyTasks } from 'test/hooks/index.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/tricky-task/pool', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('POST /create', () => {
    describe('when valid tasks are provided', async () => {
      it('then should create tasks and return their ids', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/tricky-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: trickyTasks,
        });

        expect(res.statusCode).toBe(201);
        const resData = (await res.json()) as { id: string }[];
        expect(resData.length).toEqual(trickyTasks.length);
        for (const task of resData) expect(task.id).toBeUuidV4();
        expect(await app.prisma.trickyTask.findMany({
          where: {
            id: {
              in: resData.map(task => task.id),
            },
          },
        })).toBeDefined();

        await cleanUpTrickyTasks(app, adminCookie, resData.map((task: { id: string }) => task.id));
      });
    });

    describe('when correctWord is empty', async () => {
      it('then should return 400 with proper message', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/tricky-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [{
            age: 8,
            correctWord: '',
            incorrectWord: 'test',
          }],
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
      });
    });

    describe('when incorrectWord is empty', async () => {
      it('then should return 400 with proper message', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/tricky-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [{
            age: 8,
            correctWord: 'test',
            incorrectWord: '',
          }],
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
      });
    });
  });

  describe('DELETE /delete', () => {
    describe('when valid task ids are provided', async () => {
      it('then should delete tasks', async () => {
        const task = trickyTasks[0];
        const resCreate = await app.inject({
          method: 'POST',
          url: '/api/tricky-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [task],
        });

        expect(resCreate.statusCode).toBe(201);
        const taskId = (await resCreate.json())[0].id as string;
        expect(await app.prisma.trickyTask.findUnique({
          where: {
            id: taskId,
          },
        })).toBeDefined();

        const res = await app.inject({
          method: 'DELETE',
          url: '/api/tricky-task/pool/delete',
          headers: {
            Cookie: adminCookie,
          },
          body: [taskId],
        });

        expect(res.statusCode).toBe(200);
        expect(await app.prisma.trickyTask.findUnique({
          where: {
            id: taskId,
          },
        })).toBeNull();
      });
    });

    describe('when non-existing task ids are provided', async () => {
      it('then should not fail (prisma will ignore them)', async () => {
        const res = await app.inject({
          method: 'DELETE',
          url: '/api/tricky-task/pool/delete',
          headers: {
            Cookie: adminCookie,
          },
          body: [randomUUID()],
        });

        expect(res.statusCode).toBe(200);
      });
    });

    describe('when deleting tasks assigned to students', () => {
      it('then should handle cascade deletion properly', async () => {
        // TODO: implement
      });
    });
  });
});
