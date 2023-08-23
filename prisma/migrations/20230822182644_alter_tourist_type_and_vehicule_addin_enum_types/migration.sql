/*
  Warnings:

  - Changed the type of `touristType` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vehicleType` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Tourist" AS ENUM ('CARAVANISTA', 'ADMIRADOR');

-- CreateEnum
CREATE TYPE "Vehicle" AS ENUM ('MOTORHOME', 'TRAILER', 'CAMPER', 'TENT');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "touristType",
ADD COLUMN     "touristType" "Tourist" NOT NULL,
DROP COLUMN "vehicleType",
ADD COLUMN     "vehicleType" "Vehicle" NOT NULL;
