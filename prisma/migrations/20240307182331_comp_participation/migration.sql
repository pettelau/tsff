-- CreateTable
CREATE TABLE "CompetitionParticipation" (
    "clubId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,

    CONSTRAINT "CompetitionParticipation_pkey" PRIMARY KEY ("clubId","competitionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompetitionParticipation_clubId_competitionId_key" ON "CompetitionParticipation"("clubId", "competitionId");

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipation" ADD CONSTRAINT "CompetitionParticipation_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
