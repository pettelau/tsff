import "server-only"

import { PrismaClient } from "@prisma/client";
import { isFuture } from "date-fns";

const prisma = new PrismaClient();

export const getFutureMatches = async (clubId: number) => {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { homeClubId: clubId },
        { awayClubId: clubId }
      ],
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
      kickoffTime: 'asc',
    },
  });

  return matches.filter(match => isFuture(match.kickoffTime ? new Date(match.kickoffTime) : "Kickoff time not set"));
};
