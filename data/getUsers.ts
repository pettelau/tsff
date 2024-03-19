import "server-only";

import { Competition, SemesterType, User, UserRole } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const USERS_CACHE_TAG = "users";

export const getUsers = unstable_cache(
  async (
    onlyService: boolean = false,
    onlyHasClub: boolean = false,
  ): Promise<User[]> => {
    const whereClause: any = {};

    return await db.user.findMany({
      where: {
        ...(onlyService ? { role: UserRole.USER } : {}),
        ...(onlyHasClub ? { clubId: { not: null } } : {}),
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [USERS_CACHE_TAG],
  },
);
