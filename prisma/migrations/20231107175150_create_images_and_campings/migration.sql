-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "idCamping" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "propertyRules" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "campings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_id_key" ON "images"("id");

-- CreateIndex
CREATE UNIQUE INDEX "campings_id_key" ON "campings"("id");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_idCamping_fkey" FOREIGN KEY ("idCamping") REFERENCES "campings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
