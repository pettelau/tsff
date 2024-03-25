import { Player, MatchEvent } from "@prisma/client";
import { db } from "@/lib/db";

interface PlayerRedStats {
  player: Player;
  reds: number;
}

export const getRedStats = async (): Promise<PlayerRedStats[]> => {
  const players = await db.player.findMany({
    include: {
      squadPlayer: {
        include: {
          matchEvent: {
            where: {
              type: "RED_CARD"
            }
          }
        }
      },
      relatedClub: true
    }
  });

  const playersWithReds = players.filter((player) => {
    const totalReds = player.squadPlayer.reduce((total, squadPlayer) => {
      return total + squadPlayer.matchEvent.filter((event) => event.type === "RED_CARD").length;
    }, 0);
    return totalReds > 0;
  });

  const redStats: PlayerRedStats[] = playersWithReds.map((player) => {
    const reds = player.squadPlayer.reduce((totalReds, squadPlayer) => {
      return (
        totalReds +
        squadPlayer.matchEvent.filter((event) => event.type === "RED_CARD").length
      );
    }, 0);

    return { player, reds };
  });

  return redStats;
};