import "server-only";

import { Club, Competition } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const CLUB_CACHE_TAG = "clubs";

export const getClubInfo = unstable_cache(
  async (clubId: number): Promise<Club | null> => {
    const res = await db.club.findUnique({
      where: { id: clubId },
    });
    return res !== null ? res : null;
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [CLUB_CACHE_TAG],
  },
);
