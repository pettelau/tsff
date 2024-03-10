import { getCompetitionClubs } from "@/data/getCompetitionClubs";
import { getCompetitionMatchesWithResults } from "@/data/getCompetitionMatchesWithResults";
import { generateTable } from "@/services/generate-table-data";
import { type NextRequest } from "next/server";

export const GET = async (
  _: Request,
  { params }: { params: { id: string } },
) => {
  const compMatches = await getCompetitionMatchesWithResults(Number(params.id));

  const compClubs = await getCompetitionClubs(Number(params.id));
  const table = generateTable(compMatches, compClubs);

  return Response.json({ table: table });
};
