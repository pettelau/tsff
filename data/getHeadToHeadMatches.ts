import "server-only";

import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { ExtendedMatch } from "./getClubMatches";
import { getExtendedMatch } from "@/data/getExtendedMatch";
import { MATCHES_CACHE_TAG } from "@/data/getCompetitionMatchesWithResults";

export const getHeadToHeadMatches = unstable_cache(
  async (clubId1: number, clubId2: number): Promise<ExtendedMatch[]> => {
    const matches: ExtendedMatch[] = [];
    const matchIds = await db.match.findMany({
      where: {
        OR: [
          {
            AND: [{ homeClubId: clubId1 }, { awayClubId: clubId2 }],
          },
          {
            AND: [{ homeClubId: clubId2 }, { awayClubId: clubId1 }],
          },
        ],
      },
      select: {
        id: true,
      },
    });

    for (const match of matchIds) {
      const extendedMatch = await getExtendedMatch(match.id);
      matches.push(extendedMatch);
    }

    return matches;
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [MATCHES_CACHE_TAG],
  },
);
