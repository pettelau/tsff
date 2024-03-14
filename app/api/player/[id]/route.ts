import { PLAYERS_CACHE_TAG } from "@/data/getClubPlayers";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);
  const player = await db.player.update({
    where: {
      id: parsedId,
    },
    data,
  });
  revalidateTag(PLAYERS_CACHE_TAG);
  return Response.json(player);
};
