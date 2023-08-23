-- AlterTable
ALTER TABLE "boxes" ADD COLUMN     "idAcommodation" TEXT;

-- CreateTable
CREATE TABLE "acommodations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT[],
    "convenience" TEXT[],
    "propertyRy" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "acommodations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acommodations_id_key" ON "acommodations"("id");

-- AddForeignKey
ALTER TABLE "boxes" ADD CONSTRAINT "boxes_idAcommodation_fkey" FOREIGN KEY ("idAcommodation") REFERENCES "acommodations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acommodations" ADD CONSTRAINT "acommodations_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
