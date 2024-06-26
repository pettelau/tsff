import { CompetitionTableSmall } from "@/app/components/Competition/CompetitionTable-small";
import { CompetitionTabs } from "@/app/components/Competition/CompetitionTabs";
import { getActiveCompetitions } from "@/data/getActiveCompetitions";
import { getCompetitionClubs } from "@/data/getCompetitionClubs";
import { getCompetitionMatchesWithResults } from "@/data/getCompetitionMatchesWithResults";
import { competitionTypesMap } from "@/lib/enum-mappings";
import { getCurrentSeason } from "@/lib/utils";
import { generateTable } from "@/services/generate-table-data";

type CompetitionLayoutProps = {
  children: React.ReactNode;
};

const CompetitionLayout = async ({ children }: CompetitionLayoutProps) => {
  const activeCompetitions = await getActiveCompetitions();
  return (
    <div className="flex flex-row items-stretch justify-center flex-grow max-w-screen-2xl sm:mx-6">
      <div className="flex flex-col w-full sm:w-2/3">
        <div className="flex items-center justify-center">
          <CompetitionTabs />
        </div>
        <div>{children}</div>
      </div>
      <div className="w-1/3 flex-col items-center hidden sm:flex space-y-2">
        {activeCompetitions.map(async (comp) => {
          const compMatches = await getCompetitionMatchesWithResults(comp.id);
          const compClubs = await getCompetitionClubs(comp.id);
          const tableData = generateTable(compMatches, compClubs);
          const name =
            competitionTypesMap[comp.type].label + " " + getCurrentSeason();
          return (
            <div
              key={comp.id}
              className="w-full bg-primary rounded-xl text-center p-3 text-white"
            >
              <CompetitionTableSmall tableData={tableData} name={name} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitionLayout;
