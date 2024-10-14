/*
  Warnings:

  - You are about to drop the column `courseId` on the `skills` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_courseId_fkey";

-- AlterTable
ALTER TABLE "skills" DROP COLUMN "courseId";

-- CreateTable
CREATE TABLE "_CourseToSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToSkill_AB_unique" ON "_CourseToSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToSkill_B_index" ON "_CourseToSkill"("B");

-- AddForeignKey
ALTER TABLE "_CourseToSkill" ADD CONSTRAINT "_CourseToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToSkill" ADD CONSTRAINT "_CourseToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
