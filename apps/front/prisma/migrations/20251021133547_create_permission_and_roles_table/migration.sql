-- AlterEnum
ALTER TYPE "EnumProfileEstadoCivil" ADD VALUE 'OUTROS';

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "idTrust" TEXT;

-- CreateTable
CREATE TABLE "sync_control_table" (
    "id" TEXT NOT NULL,
    "table_in_sql" TEXT NOT NULL,
    "table_in_postgres" TEXT NOT NULL,
    "last_sync" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sync_control_table_pkey" PRIMARY KEY ("id")
);
