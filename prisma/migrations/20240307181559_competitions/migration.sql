/*
  Warnings:

  - Added the required column `competitionRoundId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompetitionType" AS ENUM ('AVDELING_A', 'AVDELING_B', 'AVDELING_C', 'A_SLUTTSPILL', 'B_SLUTTSPILL', 'C_SLUTTSPILL', 'D_SLUTTSPILL', 'E_SLUTTSPILL', 'FRIENDLY');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "competitionRoundId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Competition" (
    "id" SERIAL NOT NULL,
    "type" "CompetitionType" NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitionRound" (
    "id" SERIAL NOT NULL,
    "round" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,

    CONSTRAINT "CompetitionRound_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionRound_round_competitionId_key" ON "CompetitionRound"("round", "competitionId");

-- AddForeignKey
ALTER TABLE "CompetitionRound" ADD CONSTRAINT "CompetitionRound_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_competitionRoundId_fkey" FOREIGN KEY ("competitionRoundId") REFERENCES "CompetitionRound"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
