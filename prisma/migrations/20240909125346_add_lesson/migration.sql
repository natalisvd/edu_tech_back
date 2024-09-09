/*
  Warnings:

  - You are about to drop the column `materials` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "materials",
DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "text" TEXT,
    "matrials" TEXT[],
    "indexNumber" INTEGER NOT NULL,
    "courseId" TEXT,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
