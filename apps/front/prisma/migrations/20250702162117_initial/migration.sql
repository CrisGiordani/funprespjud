-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('USER_ADMIN', 'USER_OPERATOR', 'USER_PARTICIPANT', 'USER_SPONSOR');

-- CreateEnum
CREATE TYPE "EnumProfileEstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "RoleEnum"[] DEFAULT ARRAY['USER_PARTICIPANT']::"RoleEnum"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "dtNascimento" TIMESTAMP(3) NOT NULL,
    "sexo" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "naturalidade" TEXT NOT NULL,
    "naturalidadeUf" TEXT NOT NULL,
    "nacionalidade" TEXT NOT NULL,
    "estadoCivil" "EnumProfileEstadoCivil" NOT NULL,
    "politicamenteExposto" BOOLEAN NOT NULL DEFAULT false,
    "rg" TEXT NOT NULL,
    "rgEmissor" TEXT NOT NULL,
    "rgUf" TEXT NOT NULL,
    "rgEmissao" TIMESTAMP(3) NOT NULL,
    "nmMae" TEXT NOT NULL,
    "nmPai" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verify_codes" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verify_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "profile_idUser_key" ON "profile"("idUser");
