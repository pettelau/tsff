-- DropForeignKey
ALTER TABLE "Squad" DROP CONSTRAINT "Squad_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Squad" DROP CONSTRAINT "Squad_matchId_fkey";

-- DropForeignKey
ALTER TABLE "SquadPlayer" DROP CONSTRAINT "SquadPlayer_playerId_fkey";

-- DropForeignKey
ALTER TABLE "SquadPlayer" DROP CONSTRAINT "SquadPlayer_squadId_fkey";

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadPlayer" ADD CONSTRAINT "SquadPlayer_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadPlayer" ADD CONSTRAINT "SquadPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
