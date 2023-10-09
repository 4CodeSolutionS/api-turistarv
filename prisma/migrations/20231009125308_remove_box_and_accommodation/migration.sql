/*
  Warnings:

  - You are about to drop the column `rvLength` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rvPlate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `touristType` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tugPlate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleType` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `acommodations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boxes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "acommodations" DROP CONSTRAINT "acommodations_idUser_fkey";

-- DropForeignKey
ALTER TABLE "boxes" DROP CONSTRAINT "boxes_idAcommodation_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "rvLength",
DROP COLUMN "rvPlate",
DROP COLUMN "touristType",
DROP COLUMN "tugPlate",
DROP COLUMN "vehicleType";

-- DropTable
DROP TABLE "acommodations";

-- DropTable
DROP TABLE "boxes";

-- DropEnum
DROP TYPE "Tourist";

-- DropEnum
DROP TYPE "Vehicle";
