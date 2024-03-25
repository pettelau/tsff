import { Player, MatchEvent } from "@prisma/client";
import { db } from "@/lib/db";

interface PlayerGoalStats {
  player: Player;
  goals: number;
}

export const getGoalStats = async (): Promise<PlayerGoalStats[]> => {
  const players = await db.player.findMany({
    include: {
      squadPlayer: {
        include: {
          matchEvent: {
            where: {
              type: "GOAL"
            }
          }
        }
      },
      relatedClub: true 
    }
  });

  const playersWithGoals = players.filter((player) => {
    const totalGoals = player.squadPlayer.reduce((total, squadPlayer) => {
      return total + squadPlayer.matchEvent.filter((event) => event.type === "GOAL").length;
    }, 0);
    return totalGoals > 0;
  });

  const goalStats: PlayerGoalStats[] = playersWithGoals.map((player) => {
    const goals = player.squadPlayer.reduce((totalGoals, squadPlayer) => {
      return (
        totalGoals +
        squadPlayer.matchEvent.filter((event) => event.type === "GOAL").length
      );
    }, 0);

    return { player, goals };
  });

  return goalStats;
};

