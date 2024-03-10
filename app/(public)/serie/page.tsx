import { getActiveCompetitions } from "@/data/getActiveCompetitions";
// import { getCompetitionMatches } from "@/data/getCompetitionMatchesWithResults";
import { db } from "@/lib/db";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { getCurrentSeason } from "@/lib/utils";
import { Button } from "@nextui-org/button";

const MatchesPage = async () => {
  const activeCompetitions = await getActiveCompetitions();

  return (
    <div className="flex flex-col items-center justify-center my-20 space-y-4">
      <Button className="text-primary-900 bg-primary-600">Lagre</Button>
      <Button color="secondary" className="">
        Endre
      </Button>
      <Button color="danger" className="">
        Avbryt
      </Button>
    </div>
  );
};

export default MatchesPage;
