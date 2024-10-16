/*
  Warnings:

  - You are about to drop the `user_skills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_skills" DROP CONSTRAINT "user_skills_userId_fkey";

-- DropTable
DROP TABLE "user_skills";

-- CreateTable
CREATE TABLE "userSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "userSkill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userSkill" ADD CONSTRAINT "userSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userSkill" ADD CONSTRAINT "userSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
