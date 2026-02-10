import { randomUUID } from 'crypto';
import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { genitiveTasks } from 'test/fixtures/genitive-tasks.js';
import { cleanUpGenitiveTasks } from 'test/hooks/index.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/genitive-task/pool', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('/create', () => {
    describe('when valid tasks are provided', async () => {
      it('then should create tasks and return their ids', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: genitiveTasks,
        });

        expect(res.statusCode).toBe(201);
        const resData = (await res.json()) as { id: string }[];
        expect(resData.length).toEqual(genitiveTasks.length);
        for (const task of resData) expect(task.id).toBeUuidV4();
        expect(await app.prisma.genitiveTask.findMany({
          where: {
            id: {
              in: resData.map(task => task.id),
            },
          },
        })).toBeDefined();

        await cleanUpGenitiveTasks(app, adminCookie, resData.map((task: { id: string }) => task.id));
      });
    });

    describe('when no options are provided', async () => {
      it('then should return 400 with proper message', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [{
            nominative: 'test',
            options: [],
          }],
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
      });
    });

    describe('when less than 2 options are provided', async () => {
      it('then should return 400 with proper message', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [{
            nominative: 'test',
            options: [{ word: 'test', correct: true }],
          }],
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
      });
    });

    describe('when more than 1 correct option is provided', async () => {
      it('then should return 400 with proper message', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [{
            nominative: 'test',
            options: [{ word: 'test', correct: true }, { word: 'test', correct: true }],
          }],
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
      });
    });

    describe('when no correct option is provided', async () => {
      it('then should return 400 with proper message', async () => {
        const res = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [{
            nominative: 'test',
            options: [{ word: 'test', correct: false }, { word: 'test', correct: false }],
          }],
        });

        expect(res.statusCode).toBe(400);
        expect(res.json()).toStrictEqual({ code: 'VALIDATION', message: 'Request validation failed' });
      });
    });
  });

  describe('/delete', () => {
    describe('when valid task ids are provided', async () => {
      it('then should delete tasks', async () => {
        const task = genitiveTasks[0];
        const resCreate = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: {
            Cookie: adminCookie,
          },
          body: [task],
        });

        expect(resCreate.statusCode).toBe(201);
        const taskId = (await resCreate.json())[0].id as string;
        expect(await app.prisma.genitiveTask.findUnique({
          where: {
            id: taskId,
          },
        })).toBeDefined();

        const res = await app.inject({
          method: 'DELETE',
          url: '/api/genitive-task/pool/delete',
          headers: {
            Cookie: adminCookie,
          },
          body: [taskId],
        });

        expect(res.statusCode).toBe(200);
        expect(await app.prisma.genitiveTask.findUnique({
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
          url: '/api/genitive-task/pool/delete',
          headers: {
            Cookie: adminCookie,
          },
          body: [randomUUID()],
        });

        expect(res.statusCode).toBe(200);
      });
    });
  });
});
