import { getActiveCompetitions } from "@/data/getActiveCompetitions";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { getCurrentSeason } from "@/lib/utils";

const MatchesPage = async () => {
  const activeCompetitions = await getActiveCompetitions();

  console.log(activeCompetitions);
  return (
    <div className="flex flex-col items-center justify-center my-20">
      KAMPER ...
    </div>
  );
};

export default MatchesPage;
