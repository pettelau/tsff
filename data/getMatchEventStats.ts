import { Player, MatchEventType, Club, MatchEvent } from "@prisma/client";
import { db } from "@/lib/db";
import { minutesToSeconds } from "date-fns";
import { MATCH_EVENTS_CACHE_TAG } from "./getExtendedMatchEvents";
import { MATCH_SQUADS_CACHE_TAG } from "./getExtendedMatchSquads";
import { MATCHES_CACHE_TAG } from "./getCompetitionMatchesWithResults";
import { PLAYERS_CACHE_TAG } from "./getClubPlayers";
import { CLUB_CACHE_TAG } from "./getClubInfo";
import { unstable_cache } from "next/cache";
import { PlayerWithClub } from "@/types/types";

export type PlayerMatchEventStats = {
  player: PlayerWithClub;
  count: number;
};

export const getMatchEventStats = unstable_cache(
  async (eventType: MatchEventType): Promise<PlayerMatchEventStats[]> => {
    const players = await db.player.findMany({
      where: {
        squadPlayer: {
          some: {
            matchEvent: {
              some: {
                type: eventType,
              },
            },
          },
        },
      },
      include: {
        relatedClub: true,
        squadPlayer: {
          include: {
            matchEvent: {
              where: {
                type: eventType,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    let eventStats: PlayerMatchEventStats[] = players
      .map((player) => ({
        player: {
          id: player.id,
          firstName: player.firstName,
          lastName: player.lastName,
          club: player.relatedClub,
        },
        count: player.squadPlayer.reduce(
          (total, squadPlayer) => total + squadPlayer.matchEvent.length,
          0,
        ),
      }))
      .filter((stat) => stat.count > 0);

    eventStats = eventStats.sort((a, b) => b.count - a.count).slice(0, 10);

    return eventStats;
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [
      MATCH_EVENTS_CACHE_TAG,
      MATCH_SQUADS_CACHE_TAG,
      MATCHES_CACHE_TAG,
      PLAYERS_CACHE_TAG,
      CLUB_CACHE_TAG,
    ],
  },
);
