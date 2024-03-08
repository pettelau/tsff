import "server-only";

import { Competition, SemesterType } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentSemesterType, getCurrentYear } from "@/lib/utils";

export const COMPETITION_CACHE_TAG = "competitions";
const isSpring = getCurrentSemesterType() === SemesterType.SPRING;
const year = getCurrentYear();

export const getActiveCompetitions = unstable_cache(
  async (): Promise<Competition[]> => {
    return await db.competition.findMany({
      where: isSpring
        ? {
            OR: [
              { semester: SemesterType.SPRING, year: year },
              { semester: SemesterType.AUTUMN, year: year - 1 },
            ],
          }
        : { semester: SemesterType.AUTUMN, year: year },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [COMPETITION_CACHE_TAG],
  },
);
