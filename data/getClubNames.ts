import "server-only";

import { Club, Competition } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const CLUB_CACHE_TAG = "clubs";

export type ClubName = {
  id: Club["id"];
  name: Club["name"];
};
export const getClubNames = unstable_cache(
  async () => {
    return await db.club.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [CLUB_CACHE_TAG],
  },
);
