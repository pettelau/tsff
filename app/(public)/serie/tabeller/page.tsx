import { CompetitionTable } from "@/app/components/Competition/CompetitionTable";
import { getActiveCompetitions } from "@/data/getActiveCompetitions";
import { getCompetitionClubs } from "@/data/getCompetitionClubs";
import { getCompetitionMatchesWithResults } from "@/data/getCompetitionMatchesWithResults";
import { generateTable } from "@/services/generate-table-data";

const ActiveTablesPage = async () => {
  const activeCompetitions = await getActiveCompetitions();
  return (
    <div className="flex flex-col space-y-4 mx-5">
      {activeCompetitions.map(async (comp) => {
        const compMatches = await getCompetitionMatchesWithResults(comp.id);
        const compClubs = await getCompetitionClubs(comp.id);
        const tableData = generateTable(compMatches, compClubs);
        return (
          <div
            key={comp.id}
            className="w-full bg-primary rounded-xl text-center p-3 text-white"
          >
            <CompetitionTable tableData={tableData} />
          </div>
        );
      })}
    </div>
  );
};

export default ActiveTablesPage;
