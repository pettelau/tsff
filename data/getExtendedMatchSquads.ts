import "server-only";

import { Player, Squad, SquadPlayer } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { PLAYERS_CACHE_TAG } from "./getClubPlayers";

export const MATCH_SQUADS_CACHE_TAG = "matchSquads";

export type ExtendedMatchSquad = Squad & {
  players: (SquadPlayer & {
    player: Player;
  })[];
};

export const getExtendedMatchSquads = unstable_cache(
  async (matchId: number): Promise<ExtendedMatchSquad[]> => {
    return await db.squad.findMany({
      where: {
        matchId: matchId,
      },
      include: {
        players: {
          include: {
            player: true,
          },
        },
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [MATCH_SQUADS_CACHE_TAG, PLAYERS_CACHE_TAG],
  },
);
