import "server-only";

import { Club, Competition } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const TEAM_CACHE_TAG = "teams";

export const getTeamName = unstable_cache(
  async (teamId: number): Promise<Club["name"] | null> => {
    const res = await db.club.findUnique({
      where: { id: teamId },
      select: {
        name: true,
      },
    });
    return res !== null ? res.name : null;
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [TEAM_CACHE_TAG],
  },
);
