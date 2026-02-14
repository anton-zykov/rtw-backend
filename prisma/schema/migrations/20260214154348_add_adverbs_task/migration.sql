-- CreateTable
CREATE TABLE "AdverbsTask" (
    "id" TEXT NOT NULL,
    "options" JSONB NOT NULL,

    CONSTRAINT "AdverbsTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAdverbsTask" (
    "studentId" UUID NOT NULL,
    "taskId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "timesSeen" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" TIMESTAMPTZ(3),

    CONSTRAINT "StudentAdverbsTask_pkey" PRIMARY KEY ("studentId","taskId")
);

-- CreateIndex
CREATE INDEX "StudentAdverbsTask_studentId_idx" ON "StudentAdverbsTask"("studentId");

-- CreateIndex
CREATE INDEX "StudentAdverbsTask_taskId_idx" ON "StudentAdverbsTask"("taskId");

-- AddForeignKey
ALTER TABLE "StudentAdverbsTask" ADD CONSTRAINT "StudentAdverbsTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAdverbsTask" ADD CONSTRAINT "StudentAdverbsTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "AdverbsTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
