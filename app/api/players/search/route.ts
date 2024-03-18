import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import stringSimilarity from "string-similarity-js";

export const GET = async (request: NextRequest) => {
  const user = currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let search = request.nextUrl.searchParams.get("search");
  const page = parseInt(request.nextUrl.searchParams.get("page") || "0", 10);
  const onlyFree = request.nextUrl.searchParams.get("onlyfree") === "true";
  const take = 10;

  search = search ? search.trim() : "";

  let whereClause = {};

  if (search) {
    const searchParts = search.split(" ");

    if (searchParts.length > 1) {
      const firstNamePart = searchParts.slice(0, -1).join(" ");
      const lastNamePart = searchParts[searchParts.length - 1];

      whereClause = {
        OR: [
          {
            AND: [
              { firstName: { startsWith: firstNamePart, mode: "insensitive" } },
              { lastName: { startsWith: lastNamePart, mode: "insensitive" } },
            ],
          },
          searchParts.length === 2
            ? {
                AND: [
                  {
                    firstName: {
                      contains: searchParts[0],
                      mode: "insensitive",
                    },
                  },
                  {
                    lastName: {
                      startsWith: searchParts[1],
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : undefined,
        ].filter(Boolean),
      };
    } else {
      whereClause = {
        OR: [
          { firstName: { startsWith: search, mode: "insensitive" } },
          { lastName: { startsWith: search, mode: "insensitive" } },
        ],
      };
    }
  }

  let players = await db.player.findMany({
    where: whereClause,
    take: take + 1,
    skip: page * take,
  });

  const moreAvailable = players.length > take;

  players = moreAvailable ? players.slice(0, take) : players;

  const rankedPlayers = players
    .filter((player) => (onlyFree ? player.clubId === null : true))
    .map((player) => ({
      ...player,
      similarity: stringSimilarity(
        `${player.firstName} ${player.lastName}`,
        search ? search : "",
      ),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .map(({ similarity, ...player }) => player);

  return Response.json({
    players: rankedPlayers,
    moreAvailable: moreAvailable,
  });
};
