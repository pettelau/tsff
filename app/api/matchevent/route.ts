import { MATCHES_CACHE_TAG } from "@/data/getCompetitionMatchesWithResults";
import { MATCH_EVENTS_CACHE_TAG } from "@/data/getExtendedMatchEvents";
import { MATCH_SQUADS_CACHE_TAG } from "@/data/getExtendedMatchSquads";
import { NOTIFICATIONS_CACHE_TAG } from "@/data/getNotifications";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { data } = await request.json();

  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clubIds = await db.squadPlayer.findFirst({
    where: {
      id: data.squadPlayerId,
    },
    select: {
      squad: {
        select: {
          match: {
            select: {
              homeClubId: true,
              awayClubId: true,
            },
          },
        },
      },
    },
  });

  const squadPlayerClubId = await db.squadPlayer.findFirst({
    where: {
      id: data.squadPlayerId,
    },
    select: {
      player: {
        select: {
          clubId: true,
        },
      },
    },
  });

  if (!clubIds) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (
    dbUser.role !== UserRole.ADMIN &&
    squadPlayerClubId?.player.clubId !== dbUser.clubId
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await db.matchEvent.create({
    data: {
      squadPlayerId: data.squadPlayerId,
      type: data.eventType,
    },
  });

  revalidateTag(MATCH_EVENTS_CACHE_TAG);
  revalidateTag(MATCHES_CACHE_TAG);
  revalidateTag(MATCH_SQUADS_CACHE_TAG);

  return Response.json(event);
};
