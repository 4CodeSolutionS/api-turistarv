/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `campings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "campings_name_key" ON "campings"("name");
