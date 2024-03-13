import { CompetitionTableFullWidth } from "@/app/components/Competition/CompetitionTable-fullWidth";
import { getActiveCompetitions } from "@/data/getActiveCompetitions";
import { getCompetitionClubs } from "@/data/getCompetitionClubs";
import { getCompetitionMatchesWithResults } from "@/data/getCompetitionMatchesWithResults";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { getCurrentSeason } from "@/lib/utils";
import { generateTable } from "@/services/generate-table-data";

const ActiveTablesPage = async () => {
  const activeCompetitions = await getActiveCompetitions();
  return (
    <div className="flex flex-col space-y-4 mx-5 sm:hidden">
      {activeCompetitions.map(async (comp) => {
        const compMatches = await getCompetitionMatchesWithResults(comp.id);
        const compClubs = await getCompetitionClubs(comp.id);
        const tableData = generateTable(compMatches, compClubs);
        const name =
          competitionTypesMap[comp.type].label + " " + getCurrentSeason();
        return (
          <div
            key={comp.id}
            className="w-full bg-primary rounded-xl text-center p-3 text-white sm:hidden"
          >
            <CompetitionTableFullWidth tableData={tableData} name={name} />
          </div>
        );
      })}
    </div>
  );
};

export default ActiveTablesPage;
