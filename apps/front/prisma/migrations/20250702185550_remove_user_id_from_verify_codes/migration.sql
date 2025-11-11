/*
  Warnings:

  - You are about to drop the column `idUser` on the `verify_codes` table. All the data in the column will be lost.
  - Added the required column `cpf` to the `verify_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "verify_codes" DROP COLUMN "idUser",
ADD COLUMN     "cpf" TEXT NOT NULL;
