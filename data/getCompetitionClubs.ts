import "server-only";

import { Club, Competition } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const TEAM_CACHE_TAG = "teams";

export const getCompetitionClubs = unstable_cache(
  async (competitionId: number): Promise<Club[]> => {
    const res = await db.competitionParticipation.findMany({
      where: {
        competitionId: competitionId,
      },
      include: {
        club: true,
      },
    });
    const clubs = res.map((participation) => participation.club);
    return clubs;
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [TEAM_CACHE_TAG],
  },
);
