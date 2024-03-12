import { getActiveCompetitions } from "@/data/getActiveCompetitions";
// import { getCompetitionMatches } from "@/data/getCompetitionMatchesWithResults";
import { db } from "@/lib/db";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { getCurrentSeason } from "@/lib/utils";
import { Button } from "@nextui-org/button";

const MatchesPage = async () => {
  const activeCompetitions = await getActiveCompetitions();

  return <div className="flex flex-col items-center justify-center"></div>;
};

export default MatchesPage;
