import { db } from "@/lib/db";
import { isFuture } from "date-fns";

/**
 * Fetch future matches for a given club.
 * @param clubId - The ID of the club.
 * @returns A list of future matches.
 */
export const getFutureMatches = async (clubId: number) => {
  const matches = await db.match.findMany({
    where: {
      OR: [{ homeClubId: clubId }, { awayClubId: clubId }],
      kickoffTime: {
        gte: new Date(),
      },
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
    orderBy: {
      kickoffTime: "asc",
    },
  });

  return matches;
};

/**
 * Fetch the last 5 completed matches for a given club.
 * @param clubId - The ID of the club.
 * @returns A list of the last 5 completed matches.
 */
export const getPastMatches = async (clubId: number) => {
  const pastMatches = await db.match.findMany({
    where: {
      OR: [{ homeClubId: clubId }, { awayClubId: clubId }],
      AND: {
        kickoffTime: {
          lt: new Date(),
        },
      },
    },
    orderBy: {
      kickoffTime: "desc",
    },
    take: 5,
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  return pastMatches;
};
