import "server-only";

import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { MATCHES_CACHE_TAG } from "./getCompetitionMatchesWithResults";
import { ExtendedMatch } from "./getClubMatches";

export const getExtendedMatch = unstable_cache(
  async (matchId: number): Promise<ExtendedMatch> => {
    return await db.match.findUniqueOrThrow({
      where: {
        id: matchId,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        competitionRound: {
          include: {
            competition: true,
          },
        },
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [MATCHES_CACHE_TAG],
  },
);
