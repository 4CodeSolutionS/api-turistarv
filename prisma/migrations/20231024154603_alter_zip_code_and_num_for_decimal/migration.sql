/*
  Warnings:

  - Changed the type of `num` on the `addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `zipCode` on the `addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "num",
ADD COLUMN     "num" DECIMAL(65,30) NOT NULL,
DROP COLUMN "zipCode",
ADD COLUMN     "zipCode" DECIMAL(65,30) NOT NULL;
