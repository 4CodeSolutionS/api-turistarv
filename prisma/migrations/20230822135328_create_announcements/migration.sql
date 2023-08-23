-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'EXPIRED', 'INATIVE');

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "idAnnouncement" TEXT;

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "contactInfo" TEXT[],
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "emphasis" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "rate" INTEGER NOT NULL DEFAULT 0,
    "linkDetails" TEXT NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "announcements_id_key" ON "announcements"("id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_idAnnouncement_fkey" FOREIGN KEY ("idAnnouncement") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
