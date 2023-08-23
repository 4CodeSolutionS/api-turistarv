/*
  Warnings:

  - You are about to drop the column `propertyRy` on the `acommodations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "acommodations" DROP COLUMN "propertyRy",
ADD COLUMN     "propertyRules" TEXT[];
