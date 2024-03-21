import "server-only";

import { Player } from "@prisma/client";
import { minutesToSeconds } from "date-fns";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export const PLAYERS_CACHE_TAG = "players";

export const getClubPlayers = unstable_cache(
  async (clubId: number, includeNotActive?: boolean): Promise<Player[]> => {
    return await db.player.findMany({
      where: { clubId: clubId, isActive: includeNotActive ? undefined : true },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(120),
    tags: [PLAYERS_CACHE_TAG],
  },
);
