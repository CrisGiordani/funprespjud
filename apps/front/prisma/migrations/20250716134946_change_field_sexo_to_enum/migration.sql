/*
  Warnings:

  - Changed the type of `sexo` on the `profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnumProfileSexo" AS ENUM ('MASCULINO', 'FEMININO');

-- AlterTable
ALTER TABLE "profile" DROP COLUMN "sexo",
ADD COLUMN     "sexo" "EnumProfileSexo" NOT NULL;
