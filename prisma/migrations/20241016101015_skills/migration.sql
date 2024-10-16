/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `skills` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "skills_title_key" ON "skills"("title");
