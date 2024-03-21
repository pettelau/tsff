/*
  Warnings:

  - You are about to drop the column `matchId` on the `MatchEvent` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `MatchEvent` table. All the data in the column will be lost.
  - Added the required column `squadPlayerId` to the `MatchEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchEvent" DROP CONSTRAINT "MatchEvent_playerId_fkey";

-- AlterTable
ALTER TABLE "MatchEvent" DROP COLUMN "matchId",
DROP COLUMN "playerId",
ADD COLUMN     "squadPlayerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Squad" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadPlayer" (
    "id" SERIAL NOT NULL,
    "squadId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "SquadPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Squad_matchId_clubId_key" ON "Squad"("matchId", "clubId");

-- CreateIndex
CREATE UNIQUE INDEX "SquadPlayer_squadId_playerId_key" ON "SquadPlayer"("squadId", "playerId");

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadPlayer" ADD CONSTRAINT "SquadPlayer_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadPlayer" ADD CONSTRAINT "SquadPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_squadPlayerId_fkey" FOREIGN KEY ("squadPlayerId") REFERENCES "SquadPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
