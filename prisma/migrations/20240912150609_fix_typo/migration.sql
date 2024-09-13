/*
  Warnings:

  - You are about to drop the column `matrials` on the `lessons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "matrials",
ADD COLUMN     "materials" TEXT[];
