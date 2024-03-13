-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('MAN', 'WOMAN');

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "gender" "GenderType" DEFAULT 'MAN';
