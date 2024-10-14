/*
  Warnings:

  - You are about to drop the column `description` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `isConfirmed` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `skillTestingTempateId` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `skills` table. All the data in the column will be lost.
  - You are about to drop the column `skillTestingId` on the `tests` table. All the data in the column will be lost.
  - You are about to drop the `skills_testing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `level` to the `skills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `skills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeOfSkills` to the `skills` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeOfSkiils" AS ENUM ('PRIMARY', 'ADDITIONAL');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('JUNIOR', 'MIDLE', 'SENIOR');

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_skillTestingTempateId_fkey";

-- DropForeignKey
ALTER TABLE "skills" DROP CONSTRAINT "skills_userId_fkey";

-- DropForeignKey
ALTER TABLE "tests" DROP CONSTRAINT "tests_skillTestingId_fkey";

-- DropForeignKey
ALTER TABLE "text_questions" DROP CONSTRAINT "text_questions_skillTestingId_fkey";

-- AlterTable
ALTER TABLE "skills" DROP COLUMN "description",
DROP COLUMN "isConfirmed",
DROP COLUMN "skillTestingTempateId",
DROP COLUMN "userId",
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "level" "Level" NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "typeOfSkills" "TypeOfSkiils" NOT NULL;

-- AlterTable
ALTER TABLE "tests" DROP COLUMN "skillTestingId";

-- DropTable
DROP TABLE "skills_testing";

-- CreateTable
CREATE TABLE "user_skills" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
