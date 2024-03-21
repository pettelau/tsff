import "server-only";

import { Club, Competition, CompetitionRound, Match } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { getActiveCompetitions } from "./getActiveCompetitions";
import { MATCHES_CACHE_TAG } from "./getCompetitionMatchesWithResults";

export type ExtendedMatch = Match & {
  competitionRound: CompetitionRound & {
    competition: Competition;
  };
  homeTeam: Club;
  awayTeam: Club;
};
export const getClubMatches = unstable_cache(
  async (
    clubId: number,
    page: number = 0,
    pageSize: number = 7,
    finishedMatchesLimit: number = 3,
  ) => {
    const activeCompetitions = await getActiveCompetitions();

    const allMatches: ExtendedMatch[] = await db.match.findMany({
      where: {
        OR: [{ homeClubId: clubId }, { awayClubId: clubId }],
        competitionRound: {
          competition: {
            id: {
              in: activeCompetitions.map((competition) => competition.id),
            },
          },
        },
      },
      include: {
        competitionRound: {
          include: {
            competition: true,
          },
        },
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        kickoffTime: "asc",
      },
    });

    const now = new Date();
    const finishedMatches = allMatches.filter(
      (match) => match.kickoffTime && match.kickoffTime < now,
    );

    const upcomingMatches = allMatches.filter(
      (match) => !match.kickoffTime || match.kickoffTime >= now,
    );

    let matchesToShow = [];
    let hasMorePrevious = false;
    let hasMoreNext = false;

    // For the default page, include last finishedMatchesLimit and first 4 upcoming
    if (page === 0) {
      const defaultFinished = finishedMatches.slice(-finishedMatchesLimit);
      const defaultUpcoming = upcomingMatches.slice(
        0,
        pageSize - finishedMatchesLimit,
      );

      hasMorePrevious = finishedMatches.length > finishedMatchesLimit;
      hasMoreNext = upcomingMatches.length > pageSize - finishedMatchesLimit;

      matchesToShow = [...defaultFinished, ...defaultUpcoming];
    } else if (page < 0) {
      // Calc what the starting point will be on a reversed array (newest first)
      const startIndex = finishedMatchesLimit + Math.abs(pageSize * (page + 1));

      // reverse the array, get the correct games based on pagesize,
      // reverse it back again to get the oldest matches first
      matchesToShow = finishedMatches
        .reverse()
        .slice(startIndex, startIndex + pageSize)
        .reverse();

      hasMorePrevious = startIndex + pageSize < finishedMatches.length;
      hasMoreNext = true;
    } else {
      // calculate starting poing considering upcoming matches already shown in
      // the default page 0, then slice based on pageSize
      const startIndex =
        pageSize * (page - 1) + (pageSize - finishedMatchesLimit);
      matchesToShow = upcomingMatches.slice(startIndex, startIndex + pageSize);

      hasMoreNext = startIndex + pageSize < upcomingMatches.length;
      hasMorePrevious = true;
    }

    return {
      matches: matchesToShow,
      hasMorePrevious,
      hasMoreNext,
    };
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [MATCHES_CACHE_TAG],
  },
);
