/*
  Warnings:

  - Added the required column `semester` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SemesterType" AS ENUM ('AUTUMN', 'SPRING');

-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "semester" "SemesterType" NOT NULL;
