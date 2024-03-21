import { getClubMatches } from "@/data/getClubMatches";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {

  const page = parseInt(request.nextUrl.searchParams.get("page") || "0", 10);

  const pageSize = parseInt(
    request.nextUrl.searchParams.get("pageSize") || "7",
    10,
  );

  const finishedMatchesCount = parseInt(
    request.nextUrl.searchParams.get("finishedMatchesCount") || "3",
    10,
  );

  const matches = await getClubMatches(
    parseInt(params.id),
    page,
    pageSize,
    finishedMatchesCount,
  );
  return Response.json(matches);
};
