import { MATCHES_CACHE_TAG } from "@/data/getCompetitionMatchesWithResults";
import { MATCH_EVENTS_CACHE_TAG } from "@/data/getExtendedMatchEvents";
import { MATCH_SQUADS_CACHE_TAG } from "@/data/getExtendedMatchSquads";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { data } = await request.json();

  const parsedSquadId = Number(params.id);
  const { playerId: playerId, add: add }: { playerId: number; add: boolean } =
    data;

  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const player = await db.player.findFirst({
    where: {
      id: playerId,
    },
  });

  if (!player) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (dbUser.role !== UserRole.ADMIN && player.id !== dbUser.clubId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingEntry = await db.squadPlayer.findUnique({
    where: {
      squadId_playerId: {
        squadId: parsedSquadId,
        playerId: playerId,
      },
    },
  });

  if (add) {
    if (existingEntry) {
      return new Response(JSON.stringify({ message: "Player already exists" }));
    } else {
      await db.squadPlayer.create({
        data: {
          playerId: playerId,
          squadId: parsedSquadId,
        },
      });
    }
  } else {
    if (existingEntry) {
      await db.squadPlayer.delete({
        where: {
          squadId_playerId: {
            squadId: parsedSquadId,
            playerId: playerId,
          },
        },
      });
    } else {
      return new Response(
        JSON.stringify({ message: "Player already didn't exist" }),
      );
    }
  }

  revalidateTag(MATCH_SQUADS_CACHE_TAG);
  revalidateTag(MATCH_EVENTS_CACHE_TAG);
  revalidateTag(MATCHES_CACHE_TAG);

  return new Response(JSON.stringify({ message: "Spillertropp oppdatert" }), {
    status: 200,
  });
};
