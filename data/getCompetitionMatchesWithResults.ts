import "server-only";

import { unstable_cache } from "next/cache";
import { minutesToSeconds } from "date-fns";

import { db } from "@/lib/db";
import { COMPETITION_CACHE_TAG } from "@/data/getActiveCompetitions";
import { Match } from "@prisma/client";
import { MatchWithTeams } from "@/types/types";

export const MATCHES_CACHE_TAG = "matches";

export const getCompetitionMatchesWithResults = unstable_cache(
  async (
    competitionId: number,
    onlyConfirmed: boolean = false,
  ): Promise<MatchWithTeams[]> => {
    return await db.match.findMany({
      where: {
        competitionRound: {
          competitionId: competitionId,
        },
        AND: [
          {
            homeGoals: {
              not: null,
            },
          },
          {
            awayGoals: {
              not: null,
            },
          },
          onlyConfirmed
            ? {
                isMatchEventsConfirmed: true,
              }
            : {},
        ],
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [COMPETITION_CACHE_TAG, MATCHES_CACHE_TAG],
  },
);
