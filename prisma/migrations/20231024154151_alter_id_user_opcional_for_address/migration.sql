-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_idUser_fkey";

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "idUser" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
