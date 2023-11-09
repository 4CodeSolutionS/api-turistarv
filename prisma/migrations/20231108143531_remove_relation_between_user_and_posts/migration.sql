/*
  Warnings:

  - You are about to drop the column `idUser` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_idUser_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "idUser";
