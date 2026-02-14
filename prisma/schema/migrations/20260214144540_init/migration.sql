-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'student', 'teacher', 'not_set');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('genitive', 'stress', 'tricky');

-- CreateTable
CREATE TABLE "GenitiveTask" (
    "id" TEXT NOT NULL,
    "nominative" VARCHAR(255) NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "GenitiveTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGenitiveTask" (
    "studentId" UUID NOT NULL,
    "taskId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "timesSeen" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMPTZ(3),

    CONSTRAINT "StudentGenitiveTask_pkey" PRIMARY KEY ("studentId","taskId")
);

-- CreateTable
CREATE TABLE "StressTask" (
    "id" TEXT NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "StressTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentStressTask" (
    "studentId" UUID NOT NULL,
    "taskId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "timesSeen" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMPTZ(3),

    CONSTRAINT "StudentStressTask_pkey" PRIMARY KEY ("studentId","taskId")
);

-- CreateTable
CREATE TABLE "TrickyTask" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "TrickyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentTrickyTask" (
    "studentId" UUID NOT NULL,
    "taskId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "timesSeen" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMPTZ(3),

    CONSTRAINT "StudentTrickyTask_pkey" PRIMARY KEY ("studentId","taskId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "login" VARCHAR(255) NOT NULL,
    "fullName" VARCHAR(255),
    "email" VARCHAR(255),
    "telegramId" VARCHAR(20),
    "passwordHash" VARCHAR(255) NOT NULL,
    "passwordVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'not_set',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "Student" (
    "id" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "taskTypes" "TaskType"[] DEFAULT ARRAY[]::"TaskType"[]
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" UUID NOT NULL
);

-- CreateIndex
CREATE INDEX "StudentGenitiveTask_studentId_idx" ON "StudentGenitiveTask"("studentId");

-- CreateIndex
CREATE INDEX "StudentGenitiveTask_taskId_idx" ON "StudentGenitiveTask"("taskId");

-- CreateIndex
CREATE INDEX "StudentStressTask_studentId_idx" ON "StudentStressTask"("studentId");

-- CreateIndex
CREATE INDEX "StudentStressTask_taskId_idx" ON "StudentStressTask"("taskId");

-- CreateIndex
CREATE INDEX "StudentTrickyTask_studentId_idx" ON "StudentTrickyTask"("studentId");

-- CreateIndex
CREATE INDEX "StudentTrickyTask_taskId_idx" ON "StudentTrickyTask"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_id_key" ON "Student"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_id_key" ON "Teacher"("id");

-- AddForeignKey
ALTER TABLE "StudentGenitiveTask" ADD CONSTRAINT "StudentGenitiveTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGenitiveTask" ADD CONSTRAINT "StudentGenitiveTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "GenitiveTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentStressTask" ADD CONSTRAINT "StudentStressTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentStressTask" ADD CONSTRAINT "StudentStressTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "StressTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTrickyTask" ADD CONSTRAINT "StudentTrickyTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentTrickyTask" ADD CONSTRAINT "StudentTrickyTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TrickyTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
