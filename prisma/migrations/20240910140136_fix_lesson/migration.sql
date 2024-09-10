/*
  Warnings:

  - Made the column `courseId` on table `lessons` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_courseId_fkey";

-- AlterTable
ALTER TABLE "lessons" ALTER COLUMN "courseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
