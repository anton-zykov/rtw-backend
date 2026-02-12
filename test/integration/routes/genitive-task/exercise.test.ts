import { loginSuperAdminAndGetCookie, loginAsUserAndGetCookie } from 'test/helpers/auth.js';
import { buildTestServer } from 'test/helpers/buildTestServer.js';
import { prismaClient } from 'test/helpers/prismaClient.js';
import { createRedisMockWithStorage } from 'test/helpers/createRedisMockWithStorage.js';
import { genitiveTasks } from 'test/fixtures/genitive-tasks.js';
import { createUser, createTeacher, createStudent, cleanUpUser, cleanUpGenitiveTasks } from 'test/hooks/index.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('/genitive-task/exercise', () => {
  const redisMock = createRedisMockWithStorage();
  const app = buildTestServer(prismaClient, redisMock);
  let adminCookie: string;
  beforeAll(async () => {
    await app.ready();
    adminCookie = await loginSuperAdminAndGetCookie(app);
  });
  afterAll(async () => await app.close());

  describe('GET /:userId', () => {
    describe('when student has no cached exercise', () => {
      it('then should retrieve default amount (10) of tasks', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const studentCookie = await loginAsUserAndGetCookie(app, studentUser.login, 'correct-password');

        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: { Cookie: adminCookie },
          body: genitiveTasks,
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskIds = createdTasks.map(t => t.id);

        const assignRes = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            genitiveTaskIds: taskIds,
          },
        });
        expect(assignRes.statusCode).toBe(200);

        const exerciseRes = await app.inject({
          method: 'GET',
          url: `/api/genitive-task/exercise/${student.id}`,
          headers: { Cookie: studentCookie },
        });
        expect(exerciseRes.statusCode).toBe(200);
        const exercise = await exerciseRes.json() as Array<{
          taskId: string;
          nominative: string;
          options: Array<{ word: string; correct: boolean }>;
        }>;

        expect(exercise.length).toBe(10);
        for (const task of exercise) {
          expect(task.taskId).toBeUuidV4();
          expect(task.nominative).toBeDefined();
          expect(task.options.length).toBeGreaterThanOrEqual(2);
        }

        await cleanUpGenitiveTasks(app, adminCookie, taskIds);
        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when exercise is cached', () => {
      it('then should return cached results on second request', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const studentCookie = await loginAsUserAndGetCookie(app, studentUser.login, 'correct-password');

        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: { Cookie: adminCookie },
          body: genitiveTasks,
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskIds = createdTasks.map(t => t.id);

        await app.inject({
          method: 'POST',
          url: '/api/genitive-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            genitiveTaskIds: taskIds,
          },
        });

        const firstRes = await app.inject({
          method: 'GET',
          url: `/api/genitive-task/exercise/${student.id}`,
          headers: { Cookie: studentCookie },
        });
        expect(firstRes.statusCode).toBe(200);
        const firstExercise = await firstRes.json() as Array<{
          taskId: string;
          nominative: string;
          options: Array<{ word: string; correct: boolean }>;
        }>;

        // Second request (should return cached results)
        const secondRes = await app.inject({
          method: 'GET',
          url: `/api/genitive-task/exercise/${student.id}`,
          headers: { Cookie: studentCookie },
        });
        expect(secondRes.statusCode).toBe(200);
        const secondExercise = await secondRes.json() as Array<{
          taskId: string;
          nominative: string;
          options: Array<{ word: string; correct: boolean }>;
        }>;

        expect(secondExercise).toEqual(firstExercise);

        await cleanUpGenitiveTasks(app, adminCookie, taskIds);
        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });
  });

  describe('POST /check', () => {
    describe('when checking answers', () => {
      it('then should return correct results and update weights accordingly', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const studentCookie = await loginAsUserAndGetCookie(app, studentUser.login, 'correct-password');

        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: { Cookie: adminCookie },
          body: genitiveTasks.slice(0, 3),
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskIds = createdTasks.map(t => t.id);

        await app.inject({
          method: 'POST',
          url: '/api/genitive-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            genitiveTaskIds: taskIds,
          },
        });

        const exerciseRes = await app.inject({
          method: 'GET',
          url: `/api/genitive-task/exercise/${student.id}`,
          headers: { Cookie: studentCookie },
        });
        expect(exerciseRes.statusCode).toBe(200);
        const exercise = await exerciseRes.json() as Array<{
          taskId: string;
          nominative: string;
          options: Array<{ word: string; correct: boolean }>;
        }>;

        const firstTask = exercise[0]!;
        const secondTask = exercise[1]!;
        const correctAnswer = firstTask.options.find(o => o.correct)!.word;
        const incorrectAnswer = secondTask.options.find(o => !o.correct)!.word;
        const checkRes = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/exercise/check',
          headers: { Cookie: studentCookie },
          body: {
            userId: student.id,
            exercise: [
              { taskId: firstTask.taskId, answer: correctAnswer },
              { taskId: secondTask.taskId, answer: incorrectAnswer },
            ],
          },
        });

        expect(checkRes.statusCode).toBe(200);
        const results = await checkRes.json() as Array<{
          taskId: string;
          correct: boolean;
        }>;

        expect(results.length).toBe(2);
        const firstResult = results.find(r => r.taskId === firstTask.taskId)!;
        const secondResult = results.find(r => r.taskId === secondTask.taskId)!;
        expect(firstResult.correct).toBe(true);
        expect(secondResult.correct).toBe(false);

        await cleanUpGenitiveTasks(app, adminCookie, taskIds);
        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when weight reaches minimum (1)', () => {
      it('then should not decrease weight below 1', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const studentCookie = await loginAsUserAndGetCookie(app, studentUser.login, 'correct-password');

        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: { Cookie: adminCookie },
          body: [genitiveTasks[0]],
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskId = createdTasks[0]!.id;

        await app.inject({
          method: 'POST',
          url: '/api/genitive-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            genitiveTaskIds: [taskId],
          },
        });

        const studentId = student.id;
        await app.prisma.studentGenitiveTask.update({
          where: {
            studentId_taskId: {
              studentId,
              taskId,
            },
          },
          data: { weight: 1 },
        });

        const exerciseRes = await app.inject({
          method: 'GET',
          url: `/api/genitive-task/exercise/${student.id}`,
          headers: { Cookie: studentCookie },
        });
        const exercise = await exerciseRes.json() as Array<{
          taskId: string;
          options: Array<{ word: string; correct: boolean }>;
        }>;

        const correctAnswer = exercise[0]!.options.find(o => o.correct)!.word;
        await app.inject({
          method: 'POST',
          url: '/api/genitive-task/exercise/check',
          headers: { Cookie: studentCookie },
          body: {
            userId: student.id,
            exercise: [{ taskId, answer: correctAnswer }],
          },
        });

        const updatedTask = await app.prisma.studentGenitiveTask.findUnique({
          where: {
            studentId_taskId: {
              studentId,
              taskId,
            },
          },
        });
        expect(updatedTask?.weight).toBe(1);

        await cleanUpGenitiveTasks(app, adminCookie, [taskId]);
        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });

    describe('when weight reaches maximum (50)', () => {
      it('then should not increase weight above 50', async () => {
        const teacherUser = await createUser(app, adminCookie);
        await createTeacher(app, adminCookie, teacherUser.id);

        const studentUser = await createUser(app, adminCookie);
        const student = await createStudent(app, adminCookie, studentUser.id, teacherUser.id);

        const studentCookie = await loginAsUserAndGetCookie(app, studentUser.login, 'correct-password');

        const createTasksRes = await app.inject({
          method: 'POST',
          url: '/api/genitive-task/pool/create',
          headers: { Cookie: adminCookie },
          body: [genitiveTasks[0]],
        });
        expect(createTasksRes.statusCode).toBe(201);
        const createdTasks = (await createTasksRes.json()) as { id: string }[];
        const taskId = createdTasks[0]!.id;

        await app.inject({
          method: 'POST',
          url: '/api/genitive-task/student/assign',
          headers: { Cookie: adminCookie },
          body: {
            studentId: student.id,
            genitiveTaskIds: [taskId],
          },
        });

        const studentId = student.id;
        await app.prisma.studentGenitiveTask.update({
          where: {
            studentId_taskId: {
              studentId,
              taskId,
            },
          },
          data: { weight: 50 },
        });

        const exerciseRes = await app.inject({
          method: 'GET',
          url: `/api/genitive-task/exercise/${student.id}`,
          headers: { Cookie: studentCookie },
        });
        const exercise = await exerciseRes.json() as Array<{
          taskId: string;
          options: Array<{ word: string; correct: boolean }>;
        }>;

        const incorrectAnswer = exercise[0]!.options.find(o => !o.correct)!.word;
        await app.inject({
          method: 'POST',
          url: '/api/genitive-task/exercise/check',
          headers: { Cookie: studentCookie },
          body: {
            userId: student.id,
            exercise: [{ taskId, answer: incorrectAnswer }],
          },
        });

        const updatedTask = await app.prisma.studentGenitiveTask.findUnique({
          where: {
            studentId_taskId: {
              studentId,
              taskId,
            },
          },
        });
        expect(updatedTask?.weight).toBe(50);

        await cleanUpGenitiveTasks(app, adminCookie, [taskId]);
        await cleanUpUser(app, adminCookie, studentUser.id);
        await cleanUpUser(app, adminCookie, teacherUser.id);
      });
    });
  });
});
