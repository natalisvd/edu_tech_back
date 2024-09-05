/*
  Warnings:

  - You are about to drop the column `courseUrl` on the `courses` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "courseUrl",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "materials" TEXT[],
ADD COLUMN     "tags" TEXT[];

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
