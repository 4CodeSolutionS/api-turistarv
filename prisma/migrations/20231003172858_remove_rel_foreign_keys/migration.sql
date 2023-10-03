-- DropForeignKey
ALTER TABLE "acommodations" DROP CONSTRAINT "acommodations_idUser_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_idAnnouncement_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_idUser_fkey";

-- AddForeignKey
ALTER TABLE "acommodations" ADD CONSTRAINT "acommodations_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_idAnnouncement_fkey" FOREIGN KEY ("idAnnouncement") REFERENCES "announcements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
