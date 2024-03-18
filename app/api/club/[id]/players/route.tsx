import { getClubPlayers } from "@/data/getClubPlayers";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = async (
  _: Request,
  { params }: { params: { id: string } },
) => {
  const user = currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const players = await getClubPlayers(parseInt(params.id));
  return Response.json(players);
};
