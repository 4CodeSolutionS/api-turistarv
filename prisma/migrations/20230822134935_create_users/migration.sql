-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARTNER', 'GUEST');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateBirth" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "rvLength" DECIMAL(65,30) NOT NULL,
    "tugPlate" TEXT NOT NULL,
    "rvPlate" TEXT NOT NULL,
    "touristType" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
