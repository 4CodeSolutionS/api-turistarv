/*
  Warnings:

  - You are about to drop the column `idUser` on the `leads` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_idUser_fkey";

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "idUser";
