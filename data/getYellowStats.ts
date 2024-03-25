import { Player, MatchEvent } from "@prisma/client";
import { db } from "@/lib/db";

interface PlayerYellowStats {
  player: Player;
  yellows: number;
}

export const getYellowStats = async (): Promise<PlayerYellowStats[]> => {
  const players = await db.player.findMany({
    include: {
      squadPlayer: {
        include: {
          matchEvent: {
            where: {
              type: "YELLOW_CARD" // Filtrer matchevents for å få bare mål
            }
          }
        }
      },
      relatedClub: true // Inkluder klubbinformasjon
    }
  });

  // Filtrer ut spillere med null mål
  const playersWithYellows = players.filter((player) => {
    const totalYellows = player.squadPlayer.reduce((total, squadPlayer) => {
      return total + squadPlayer.matchEvent.filter((event) => event.type === "YELLOW_CARD").length;
    }, 0);
    return totalYellows > 0;
  });

  const yellowStats: PlayerYellowStats[] = playersWithYellows.map((player) => {
    const yellows = player.squadPlayer.reduce((totalYellows, squadPlayer) => {
      return (
        totalYellows +
        squadPlayer.matchEvent.filter((event) => event.type === "YELLOW_CARD").length
      );
    }, 0);

    return { player, yellows };
  });

  return yellowStats;
};