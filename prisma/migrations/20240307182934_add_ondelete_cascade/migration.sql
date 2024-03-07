-- DropForeignKey
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_clubId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionParticipation" DROP CONSTRAINT "CompetitionParticipation_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitionRound" DROP CONSTRAINT "CompetitionRound_competitionId_fkey";

-- AddForeignKey
ALTER TABLE "CompetitionRound" ADD CONSTRAINT "CompetitionRound_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
