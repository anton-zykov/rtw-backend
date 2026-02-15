/*
  Warnings:

  - You are about to drop the column `options` on the `TrickyTask` table. All the data in the column will be lost.
  - Added the required column `correctWord` to the `TrickyTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incorrectWord` to the `TrickyTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrickyTask" DROP COLUMN "options",
ADD COLUMN     "correctWord" TEXT NOT NULL,
ADD COLUMN     "incorrectWord" TEXT NOT NULL;
