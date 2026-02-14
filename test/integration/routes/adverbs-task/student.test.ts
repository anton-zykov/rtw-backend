import { randomUUID } from 'crypto';
import { loginSuperAdminAndGetCookie } from 'test/helpers/auth.js';
import { createTeacher, createStudent, createUser, cleanUpUser, cleanUpAdverbsTasks } from 'test/hooks/index.js';
import { adverbsTasks } from 'test/fixtures/adverbs-tasks.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMock } from 'test/helpers/createRedisMock.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/adverbs-task/student', () => {
  const redisMock = createRedisMock();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('POST /assign', () => {
    describe('when valid student id and task ids are provided', () => {
      it('then should assign tasks to student and return created and skipped task ids', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/pool/create',
          headers: { Cookie: adminCookie },
          body: adverbsTasks.slice(0, 3),
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskIds = createdTasks.map(t => t.id);

        const assignRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            adverbsTaskIds: taskIds,
          },
        });

        expect(assignRes.statusCode).toBe(200);
        const result = await assignRes.json() as { created: string[]; skipped: number };
        expect(result.created).toHaveLength(3);
        expect(result.skipped).toBe(0);
        for (const id of result.created) {
          expect(id).toBeUuidV4();
          expect(taskIds).toContain(id);
        }

        const assignedTasks = await app.prisma.studentAdverbsTask.findMany({
          where: {
            studentId: student.id,
            taskId: { in: taskIds },
          },
        });
        expect(assignedTasks).toHaveLength(3);

        await cleanUpAdverbsTasks(app, adminCookie, taskIds);
        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when partial duplicate assignment', () => {
      it('then should create new tasks and skip existing ones', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/pool/create',
          headers: { Cookie: adminCookie },
          body: adverbsTasks.slice(0, 4),
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskIds = createdTasks.map(t => t.id);

        const firstBatch = taskIds.slice(0, 2);
        const firstAssignRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            adverbsTaskIds: firstBatch,
          },
        });
        expect(firstAssignRes.statusCode).toBe(200);
        const firstResult = await firstAssignRes.json() as { created: string[]; skipped: number };
        expect(firstResult.created).toHaveLength(2);
        expect(firstResult.skipped).toBe(0);

        const secondBatch = taskIds;
        const secondAssignRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            adverbsTaskIds: secondBatch,
          },
        });
        expect(secondAssignRes.statusCode).toBe(200);
        const secondResult = await secondAssignRes.json() as { created: string[]; skipped: number };
        expect(secondResult.created).toHaveLength(2);
        expect(secondResult.skipped).toBe(2);
        expect(secondResult.created).toEqual(expect.arrayContaining(taskIds.slice(2, 4)));

        await cleanUpAdverbsTasks(app, adminCookie, taskIds);
        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when student id doesn\'t exist', () => {
      it('then should handle gracefully', async () => {
        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/pool/create',
          headers: { Cookie: adminCookie },
          body: [adverbsTasks[0]],
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskId = createdTasks[0]!.id;

        const nonExistentStudentId = randomUUID();
        const assignRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: nonExistentStudentId,
            adverbsTaskIds: [taskId],
          },
        });

        expect(assignRes.statusCode).toBe(500);

        await cleanUpAdverbsTasks(app, adminCookie, [taskId]);
      });
    });

    describe('when one of the task ids doesn\'t exist', () => {
      it('then should handle gracefully', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const nonExistentTaskId = randomUUID();
        const assignRes = await app.inject({
          method: 'POST',
          url: '/api/adverbs-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            adverbsTaskIds: [nonExistentTaskId],
          },
        });

        expect(assignRes.statusCode).toBe(500);

        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });
  });

  describe('DELETE /unassign', () => {
    describe('when valid student id and task ids are provided', () => {
      it.todo('then should unassign tasks from student - route not implemented');
    });

    describe('when mix of assigned and unassigned tasks provided', () => {
      it.todo('then should unassign only the assigned ones - route not implemented');
    });
  });
});
