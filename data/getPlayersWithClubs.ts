// getPlayersWithClubs.ts
import { Player, Club } from "@prisma/client";
import { db } from "@/lib/db";

interface PlayerWithClub {
  id: number;
  firstName: string;
  lastName: string | null; // Tillat null-verdier
  club: Club | null;
}

export const getPlayersWithClubs = async (): Promise<PlayerWithClub[]> => {
  const playersWithClubs = await db.player.findMany({
    include: {
      relatedClub: true
    }
  });

  const formattedPlayersWithClubs: PlayerWithClub[] = playersWithClubs.map((player) => {
    return {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      club: player.relatedClub
    };
  });

  return formattedPlayersWithClubs;
};
