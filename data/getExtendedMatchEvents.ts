import "server-only";

import { MatchEvent, Player, Squad, SquadPlayer } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { PLAYERS_CACHE_TAG } from "./getClubPlayers";
import { MATCH_SQUADS_CACHE_TAG } from "./getExtendedMatchSquads";

export const MATCH_EVENTS_CACHE_TAG = "matchEvents";

export type ExtendedMatchEvent = MatchEvent & {
  squadPlayer: SquadPlayer & {
    squad: {
      clubId: Squad["clubId"];
    };
    player: {
      firstName: Player["firstName"];
      lastName: Player["lastName"];
    };
  };
};

export const getExtendedMatchEvents = unstable_cache(
  async (matchId: number): Promise<ExtendedMatchEvent[]> => {
    return await db.matchEvent.findMany({
      where: {
        squadPlayer: {
          squad: {
            matchId: matchId,
          },
        },
      },
      include: {
        squadPlayer: {
          include: {
            squad: {
              select: {
                clubId: true,
              },
            },
            player: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [MATCH_EVENTS_CACHE_TAG, PLAYERS_CACHE_TAG, MATCH_SQUADS_CACHE_TAG],
  },
);
