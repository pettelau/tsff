import { MATCHES_CACHE_TAG } from "@/data/getCompetitionMatchesWithResults";
import { MATCH_EVENTS_CACHE_TAG } from "@/data/getExtendedMatchEvents";
import { MATCH_SQUADS_CACHE_TAG } from "@/data/getExtendedMatchSquads";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { MatchGoalsSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { data } = await request.json();

  const parsedMatchId = Number(params.id);

  const validatedFields = MatchGoalsSchema.safeParse(data);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const match = await db.match.update({
    where: {
      id: parsedMatchId,
    },
    data: { ...validatedFields.data },
  });

  revalidateTag(MATCHES_CACHE_TAG);

  return new Response(JSON.stringify({ message: "Kampresultat oppdatert" }), {
    status: 200,
  });
};
