import { PLAYERS_CACHE_TAG } from "@/data/getClubPlayers";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const PUT = async (
  request: Request,
  { params }: { params: { id: string; clubId: string } },
) => {
  const { data } = await request.json();
  const parsedPlayerId = Number(params.id);
  const parsedClubId = Number(params.clubId);

  const player = await db.player.update({
    where: {
      id: parsedPlayerId,
    },
    data: {
      clubId: data.remove ? null : parsedClubId,
    },
  });

  revalidateTag(PLAYERS_CACHE_TAG);
  return Response.json(player);
};
